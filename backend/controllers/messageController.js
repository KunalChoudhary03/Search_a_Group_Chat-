import Message from '../models/Message.js';
import { getConversationContext } from '../services/contextService.js';
import { parseTemporalFilter } from '../utils/dateUtils.js';

/**
 * Controller for retrieving messages and surrounding context.
 */

// GET /api/messages - Retrieve recent messages with optional pagination and filters
export const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 40;
    const skip = (page - 1) * limit;
    const { sender, date, sort = 'desc' } = req.query;

    const filter = {};
    if (sender && sender.trim() && sender.toLowerCase() !== 'all') {
      filter.sender = sender.trim();
    }
    if (date) {
      const temporalRange = parseTemporalFilter(date);
      if (temporalRange) {
        filter.timestamp = temporalRange;
      }
    }

    const sortDirection = sort === 'asc' ? 1 : -1;

    const messages = await Message.find(filter)
      .select('-embedding')
      .sort({ timestamp: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    // Actual MongoDB countDocuments() representing real matching documents
    const total = await Message.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      count: messages.length,
      filter: {
        sender: sender || null,
        date: date || null,
        sort,
      },
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/messages/:id/context - Retrieve surrounding messages around a specific message
export const getMessageContext = async (req, res, next) => {
  try {
    const { id } = req.params;
    const windowSize = parseInt(req.query.window, 10) || 2;
    const { date } = req.query;

    const temporalFilter = date ? parseTemporalFilter(date) : null;
    const context = await getConversationContext(id, windowSize, temporalFilter);
    if (!context) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: context,
    });
  } catch (error) {
    next(error);
  }
};


// GET /api/messages/stats - Retrieve statistics
export const getStats = async (req, res, next) => {
  try {
    const totalMessages = await Message.countDocuments();
    const participants = await Message.distinct('sender');
    const decisionThreads = await Message.distinct('threadId', { threadId: { $ne: null } });
    const embeddedCount = await Message.countDocuments({
      embedding: { $exists: true, $not: { $size: 0 } },
    });

    const [earliest, latest] = await Promise.all([
      Message.findOne().sort({ timestamp: 1 }).select('timestamp sender message').lean(),
      Message.findOne().sort({ timestamp: -1 }).select('timestamp sender message').lean(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalMessages,
        participantCount: participants.length,
        participants,
        earliestMessage: earliest ? earliest.timestamp : null,
        latestMessage: latest ? latest.timestamp : null,
        decisionThreads,
        embeddedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getMessages,
  getMessageContext,
  getStats,
};
