import mongoose from 'mongoose';
import Message from '../models/Message.js';
import { connectDB } from '../config/db.js';

/**
 * Context Service
 * Retrieves surrounding conversation messages before and after a matched message.
 * Chronologically returns: 2 messages before, the target message, 2 messages after.
 * When temporalFilter is provided, bounds context within the selected month.
 *
 * @param {string|object} targetOrId - Message document or MongoDB ObjectId/string
 * @param {number} windowSize - Number of messages before/after (default 2)
 * @param {object|null} [temporalFilter] - Optional MongoDB timestamp filter { $gte, $lt }
 * @returns {Promise<{ before: any[], target: any, after: any[], boundary?: any }|null>}
 */
export const getConversationContext = async (targetOrId, windowSize = 2, temporalFilter = null) => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  let target = targetOrId;

  if (typeof targetOrId === 'string' || targetOrId instanceof String || (targetOrId && !targetOrId.timestamp)) {
    target = await Message.findById(targetOrId).select('-embedding').lean();
  }

  if (!target) return null;

  const targetTimestamp = new Date(target.timestamp);

  // Keep displayed context inside the selected month range whenever temporalFilter is active
  const beforeQuery = {
    timestamp: {
      $lt: targetTimestamp,
      ...(temporalFilter && temporalFilter.$gte ? { $gte: temporalFilter.$gte } : {}),
    },
  };

  const afterQuery = {
    timestamp: {
      $gt: targetTimestamp,
      ...(temporalFilter && temporalFilter.$lt ? { $lt: temporalFilter.$lt } : {}),
    },
  };

  const [before, after] = await Promise.all([
    Message.find(beforeQuery)
      .select('-embedding')
      .sort({ timestamp: -1 })
      .limit(windowSize)
      .lean(),
    Message.find(afterQuery)
      .select('-embedding')
      .sort({ timestamp: 1 })
      .limit(windowSize)
      .lean(),
  ]);

  const reachedMonthStart = Boolean(temporalFilter && temporalFilter.$gte && before.length < windowSize);
  const reachedMonthEnd = Boolean(temporalFilter && temporalFilter.$lt && after.length < windowSize);

  return {
    before: before.reverse(),
    target,
    after,
    boundary: {
      reachedMonthStart,
      reachedMonthEnd,
      isFiltered: Boolean(temporalFilter),
    },
  };
};

export default {
  getConversationContext,
};

