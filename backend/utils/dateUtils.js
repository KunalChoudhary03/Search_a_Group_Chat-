/**
 * Date manipulation and formatting utilities for temporal search queries.
 */

/**
 * Formats a date into readable display string
 */
export const formatChatTimestamp = (date) => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Returns user-friendly date range label for a given month or filter input.
 * e.g. "January 2026" -> "Jan 1 – Jan 31, 2026"
 */
export const getDateRangeLabel = (dateInput) => {
  if (!dateInput || typeof dateInput !== 'string') return '';
  const lower = dateInput.trim().toLowerCase();

  const monthDetails = [
    { names: ['january', 'jan'], label: 'Jan 1 – Jan 31, 2026', month: 'January 2026' },
    { names: ['february', 'feb'], label: 'Feb 1 – Feb 28, 2026', month: 'February 2026' },
    { names: ['march', 'mar'], label: 'Mar 1 – Mar 31, 2026', month: 'March 2026' },
    { names: ['april', 'apr'], label: 'Apr 1 – Apr 30, 2026', month: 'April 2026' },
    { names: ['may'], label: 'May 1 – May 31, 2026', month: 'May 2026' },
    { names: ['june', 'jun'], label: 'Jun 1 – Jun 30, 2026', month: 'June 2026' },
  ];

  for (const m of monthDetails) {
    if (m.names.some((n) => lower.includes(n))) {
      return m.label;
    }
  }

  return '';
};

// Generates a date range filter object for MongoDB with exclusive end date
export const buildDateFilter = (startDate, endDate) => {
  const filter = {};
  if (startDate) {
    filter.$gte = new Date(startDate);
  }
  if (endDate) {
    filter.$lt = new Date(endDate);
  }
  return Object.keys(filter).length > 0 ? filter : null;
};

/**
 * Parses user date/month filter inputs into MongoDB timestamp query range.
 * Strictly uses UTC boundaries and an exclusive upper bound ($lt).
 *
 * Example:
 * January 2026:
 * start: 2026-01-01T00:00:00.000Z
 * end:   2026-02-01T00:00:00.000Z
 * MongoDB: { $gte: start, $lt: end }
 */
export const parseTemporalFilter = (dateInput) => {
  if (!dateInput || typeof dateInput !== 'string') return null;
  const trimmed = dateInput.trim();
  if (
    !trimmed ||
    trimmed.toLowerCase() === 'all' ||
    trimmed.toLowerCase() === 'any time' ||
    trimmed.toLowerCase() === 'anytime'
  ) {
    return null;
  }

  const monthIndices = {
    january: 0, jan: 0,
    february: 1, feb: 1,
    march: 2, mar: 2,
    april: 3, apr: 3,
    may: 4,
    june: 5, jun: 5,
    july: 6, jul: 6,
    august: 7, aug: 7,
    september: 8, sep: 8,
    october: 9, oct: 9,
    november: 10, nov: 10,
    december: 11, dec: 11,
  };

  const lower = trimmed.toLowerCase();

  // 1. Check for month names (e.g. "January 2026", "Feb 2026", "March")
  for (const [name, monthIndex] of Object.entries(monthIndices)) {
    const regex = new RegExp(`\\b${name}\\b`, 'i');
    if (regex.test(lower)) {
      const yearMatch = lower.match(/\b(202\d)\b/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : 2026;

      // Strictly UTC start of month: YYYY-MM-01T00:00:00.000Z
      const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
      // Strictly UTC start of next month: exclusive end date
      const end = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0, 0));

      return { $gte: start, $lt: end };
    }
  }

  // 2. Check for date range format "YYYY-MM-DD to YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}\s+to\s+\d{4}-\d{2}-\d{2}$/i.test(trimmed)) {
    const [startPart, endPart] = trimmed.split(/\s+to\s+/i);
    const [y1, m1, d1] = startPart.split('-').map(Number);
    const [y2, m2, d2] = endPart.split('-').map(Number);

    const start = new Date(Date.UTC(y1, m1 - 1, d1, 0, 0, 0, 0));
    // Exclusive end: next day 00:00:00 UTC
    const end = new Date(Date.UTC(y2, m2 - 1, d2 + 1, 0, 0, 0, 0));

    return { $gte: start, $lt: end };
  }

  // 3. Check for YYYY-MM
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    const [year, month] = trimmed.split('-').map(Number);
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    return { $gte: start, $lt: end };
  }

  // 4. Check for YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-').map(Number);
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0));
    return { $gte: start, $lt: end };
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getUTCFullYear();
    const month = parsed.getUTCMonth();
    const day = parsed.getUTCDate();
    const start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, day + 1, 0, 0, 0, 0));
    return { $gte: start, $lt: end };
  }

  return null;
};

export default {
  formatChatTimestamp,
  getDateRangeLabel,
  buildDateFilter,
  parseTemporalFilter,
};

