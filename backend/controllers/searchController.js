import { performSemanticSearch } from '../services/searchService.js';

/**
 * Controller for semantic chat search operations.
 * POST /api/search
 * Request body: { query, sender, date, limit }
 */
export const searchMessages = async (req, res, next) => {
  try {
    const { query, sender, date, startDate, endDate, limit = 10 } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required in request body.',
        results: [],
      });
    }

    const searchDate = date || (startDate && endDate ? `${startDate} to ${endDate}` : startDate || endDate);

    const searchResult = await performSemanticSearch({
      query: query.trim(),
      sender: sender || '',
      date: searchDate || '',
      limit: parseInt(limit, 10) || 10,
    });

    return res.status(200).json({
      success: true,
      query: searchResult.query,
      totalCandidates: searchResult.totalCandidates,
      count: searchResult.results.length,
      filters: {
        sender: sender || null,
        date: searchDate || null,
      },
      results: searchResult.results,
    });
  } catch (error) {
    console.error('Search error in controller:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred during semantic search.',
      results: [],
    });
  }
};

export default {
  searchMessages,
};
