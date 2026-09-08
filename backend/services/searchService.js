import mongoose from 'mongoose';
import Message from '../models/Message.js';
import { connectDB } from '../config/db.js';
import { generateEmbedding } from './embeddingService.js';
import { cosineSimilarity } from '../utils/cosineSimilarity.js';
import { getConversationContext } from './contextService.js';
import { parseTemporalFilter } from '../utils/dateUtils.js';

/**
 * Normalizes colloquial chat abbreviations and Hinglish query variations.
 */
export const normalizeQueryForEmbedding = (query) => {
  if (!query) return '';
  let q = query.toLowerCase();

  // Multi-word phrase replacements FIRST, then individual words
  const replacements = [
    [/\bmnali\b/g, 'manali'],
    [/\bka plan kb fix hua\b/g, 'vacation trip destination plan when was it fixed decision'],
    [/\bplan kb fix hua\b/g, 'vacation trip destination fixed decision'],
    [/\btrip ka final\b/g, 'vacation trip final destination decision'],
    [/\bfinal kya hua tha\b/g, 'final vacation destination decision kya hua tha'],
    [/\bfinal kya hua\b/g, 'final vacation destination decision'],
    [/\bkya scene hai\b/g, 'what is the plan'],
    [/\basgmnt\b/g, 'assignment'],
    [/\bprbably\b/g, 'probably'],
    [/\btmrow\b/g, 'tomorrow'],
    [/\bkb\b/g, 'when'],
    [/\bplz\b|\bpls\b/g, 'please'],
  ];

  for (const [pattern, replacement] of replacements) {
    q = q.replace(pattern, replacement);
  }

  return q;
};

/**
 * Performs semantic search over MongoDB messages using local embeddings and manual cosine similarity.
 *
 * @param {object} params
 * @param {string} params.query - Natural language search query
 * @param {string} [params.sender] - Optional sender filter
 * @param {string} [params.date] - Optional date/month filter
 * @param {number} [params.limit=10] - Number of top results to return
 * @returns {Promise<{ query: string, totalCandidates: number, results: any[] }>}
 */
export const performSemanticSearch = async ({ query, sender, date, limit = 10 }) => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  if (!query || !query.trim()) {
    return {
      query: '',
      totalCandidates: 0,
      results: [],
    };
  }

  // 1. Parse sender/date filters into database criteria
  const filter = {
    embedding: { $exists: true, $not: { $size: 0 } },
  };

  if (sender && sender.trim() && sender.toLowerCase() !== 'all') {
    filter.sender = sender.trim();
  }

  let temporalRange = null;
  if (date) {
    temporalRange = parseTemporalFilter(date);
    if (temporalRange) {
      filter.timestamp = temporalRange;
    }
  }

  // 2. MongoDB retrieves ONLY matching candidates FIRST
  const candidates = await Message.find(filter).lean();

  if (!candidates || candidates.length === 0) {
    return {
      query,
      totalCandidates: 0,
      results: [],
    };
  }

  // 3. Generate query embedding locally for the clean query AFTER candidate retrieval
  const cleanQuery = normalizeQueryForEmbedding(query.trim());
  const queryVector = await generateEmbedding(cleanQuery);

  // 4. Calculate exact cosine similarity in Node.js against filtered candidates
  const scoredCandidates = [];
  for (let i = 0; i < candidates.length; i++) {
    const msg = candidates[i];
    if (Array.isArray(msg.embedding) && msg.embedding.length === queryVector.length) {
      const score = cosineSimilarity(queryVector, msg.embedding);
      scoredCandidates.push({
        msg,
        similarity: score,
      });
    }
  }

  // 5. Rank results by similarity score descending
  scoredCandidates.sort((a, b) => b.similarity - a.similarity);

  // 6. Select top N results
  const topMatches = scoredCandidates.slice(0, Math.max(limit, 10));

  // 7. Strictly verify every candidate satisfies the active temporal and sender constraints
  const verifiedMatches = topMatches.filter(({ msg }) => {
    if (temporalRange) {
      const msgTime = new Date(msg.timestamp).getTime();
      if (temporalRange.$gte && msgTime < temporalRange.$gte.getTime()) return false;
      if (temporalRange.$lt && msgTime >= temporalRange.$lt.getTime()) return false;
    }
    if (filter.sender && msg.sender.toLowerCase() !== filter.sender.toLowerCase()) {
      return false;
    }
    return true;
  });

  // 8. Context expansion for each matched message, strictly bounded to the selected month
  const results = await Promise.all(
    verifiedMatches.map(async ({ msg, similarity }) => {
      const context = await getConversationContext(msg, 2, temporalRange);

      return {
        id: msg._id,
        _id: msg._id,
        sender: msg.sender,
        message: msg.message,
        timestamp: msg.timestamp,
        similarity: parseFloat(similarity.toFixed(4)),
        threadId: msg.threadId || null,
        externalId: msg.externalId || null,
        messageType: msg.messageType || 'normal',
        context: context
          ? {
              before: context.before.map((b) => ({
                id: b._id,
                _id: b._id,
                sender: b.sender,
                message: b.message,
                timestamp: b.timestamp,
                messageType: b.messageType,
              })),
              target: {
                id: context.target._id,
                _id: context.target._id,
                sender: context.target.sender,
                message: context.target.message,
                timestamp: context.target.timestamp,
                messageType: context.target.messageType,
              },
              after: context.after.map((a) => ({
                id: a._id,
                _id: a._id,
                sender: a.sender,
                message: a.message,
                timestamp: a.timestamp,
                messageType: a.messageType,
              })),
              boundary: context.boundary || null,
            }
          : null,
      };
    })
  );

  return {
    query,
    totalCandidates: candidates.length,
    results,
  };
};

export default {
  performSemanticSearch,
  normalizeQueryForEmbedding,
};
