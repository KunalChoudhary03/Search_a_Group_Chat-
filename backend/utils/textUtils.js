/**
 * Text processing utilities for synthetic group chat and semantic search.
 */

// Basic text cleaning and whitespace normalization
export const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/\s+/g, ' ');
};

// Check if message is a short/one-word response
export const isOneWordReply = (text) => {
  if (!text) return false;
  const words = text.trim().split(/\s+/);
  return words.length === 1;
};

// Clean punctuation for basic keyword matching / checking
export const stripPunctuation = (text) => {
  if (!text) return '';
  return text.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, '').toLowerCase();
};
