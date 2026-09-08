/**
 * API Service for interacting with the Group Chat Search Backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Checks backend health status
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      connected: Boolean(data?.success),
      message: data?.message || 'API is running',
      data,
    };
  } catch (error) {
    return {
      connected: false,
      message: error.message || 'Unable to connect to backend',
    };
  }
};

/**
 * Fetches real dataset and system stats
 */
export const fetchStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/stats`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.stats || null;
  } catch (error) {
    console.error('Failed to fetch dataset stats:', error);
    return null;
  }
};

/**
 * Performs semantic search over group chat messages
 * @param {string} query
 * @param {object} filters
 */
export const searchChat = async (query, filters = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, ...filters }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error communicating with search backend',
      results: [],
    };
  }
};

/**
 * Fetch surrounding message context
 * @param {string} messageId
 * @param {number} [window=2]
 * @param {string} [date=''] - Optional month/date filter to constrain context
 */
export const fetchMessageContext = async (messageId, windowSize = 2, date = '') => {
  try {
    let url = `${API_BASE_URL}/messages/${messageId}/context?window=${windowSize}`;
    if (date) {
      url += `&date=${encodeURIComponent(date)}`;
    }
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });
    const res = await response.json();
    return res.data || res;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Fetches paginated group chat messages with optional month, sender, and sort filters
 * @param {number} page
 * @param {number} limit
 * @param {object} [filters={}] - Optional { sender, date, sort }
 */
export const fetchMessages = async (page = 1, limit = 40, filters = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (filters.sender && filters.sender !== 'ALL') {
      params.append('sender', filters.sender);
    }
    if (filters.date) {
      params.append('date', filters.date);
    }
    if (filters.sort) {
      params.append('sort', filters.sort);
    }

    const response = await fetch(`${API_BASE_URL}/messages?${params.toString()}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error loading conversations',
      data: [],
      total: 0,
      page: 1,
      pages: 1,
    };
  }
};

export default {
  checkHealth,
  fetchStats,
  searchChat,
  fetchMessageContext,
  fetchMessages,
};

