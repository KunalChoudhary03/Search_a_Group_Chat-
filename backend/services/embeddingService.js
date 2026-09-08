import { pipeline } from '@xenova/transformers';

let extractorInstance = null;
let initializationPromise = null;

/**
 * Initializes and caches the local feature-extraction pipeline.
 * Uses the lightweight, fast, local Xenova/all-MiniLM-L6-v2 ONNX model.
 * Strictly local execution via ONNX Runtime in Node.js — no external API calls.
 */
export const getExtractor = async () => {
  if (extractorInstance) {
    return extractorInstance;
  }

  if (!initializationPromise) {
    initializationPromise = (async () => {
      console.log('🤖 Loading local embedding model (Xenova/all-MiniLM-L6-v2)...');
      extractorInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('✅ Local embedding model loaded successfully.');
      return extractorInstance;
    })();
  }

  return initializationPromise;
};

/**
 * Generates a local 384-dimensional normalized vector embedding for a single text string.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const generateEmbedding = async (text) => {
  const safeText = (text || '').trim() || ' ';
  const extractor = await getExtractor();
  const output = await extractor(safeText, { pooling: 'mean', normalize: true });
  const list = output.tolist();
  // list is [[...384 numbers...]]
  return list[0];
};

/**
 * Generates local normalized embeddings for an array of text messages in batches.
 * @param {string[]} texts - Array of message texts
 * @param {number} batchSize - Number of items processed per batch (default 32)
 * @returns {Promise<number[][]>} Array of 384-dimensional vector embeddings
 */
export const generateEmbeddings = async (texts, batchSize = 32) => {
  if (!texts || texts.length === 0) return [];
  const extractor = await getExtractor();
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const chunk = texts.slice(i, i + batchSize).map((t) => (t || '').trim() || ' ');
    const output = await extractor(chunk, { pooling: 'mean', normalize: true });
    const batchResults = output.tolist();
    for (const vec of batchResults) {
      allEmbeddings.push(vec);
    }
  }

  return allEmbeddings;
};

export default {
  getExtractor,
  generateEmbedding,
  generateEmbeddings,
};
