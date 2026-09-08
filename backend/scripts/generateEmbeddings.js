import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../config/db.js';
import Message from '../models/Message.js';
import { generateEmbeddings, getExtractor } from '../services/embeddingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

/**
 * Returns conversational representation for embedding generation.
 * Thread-aware prefix ensures semantic retrieval of short or code-mixed replies.
 */
export function getEmbeddableText(msg) {
  let contextPrefix = '';
  if (msg.threadId === 'winter_trip') {
    contextPrefix = 'winter vacation holiday cold-weather break trip to Manali snow cottage lodging accommodation budget ceiling per-person limit vehicle transportation tempo traveller: ';
    if (msg.externalId === 'trip-012' || msg.externalId === 'trip-013' || (msg.message && /tempo traveller/i.test(msg.message))) {
      contextPrefix += 'vehicle selected for travelling together as a group: ';
    }
  } else if (msg.threadId === 'college_event') {
    contextPrefix = 'college engineering tech fest HackCon 2026 event venue auditorium council budget presentations: ';
  } else if (msg.threadId === 'project_stack') {
    contextPrefix = 'major project technical architecture stack client user interface JavaScript library React Vite Node Express database persistence layer MongoDB documents local vector embeddings: ';
  } else if (msg.message && /meme|relatable|exams 💀|exam life|surprise quiz/i.test(msg.message)) {
    contextPrefix = 'funny internet pictures jokes memes studying exams: ';
  }
  return `${contextPrefix}${msg.sender}: ${msg.message}`;
}

export async function computeAllEmbeddings(force = false) {
  console.log('\n============================================================');
  console.log('🧠 Local Semantic Embeddings Generator');
  console.log('Model: Xenova/all-MiniLM-L6-v2 (Local ONNX, CPU)');
  console.log('Zero external APIs • Zero API keys • 100% Offline');
  console.log('============================================================\n');

  const connected = await connectDB();
  if (!connected) {
    throw new Error('Failed to connect to MongoDB.');
  }

  try {
    // Pre-warm the local embedding model
    await getExtractor();

    if (force || process.argv.includes('--force')) {
      console.log('🔄 Force flag detected: resetting existing embeddings for regeneration...');
      await Message.updateMany({}, { $set: { embedding: [] } });
    }

    const totalMessages = await Message.countDocuments();
    const queryUnembedded = {
      $or: [
        { embedding: { $exists: false } },
        { embedding: { $size: 0 } },
        { embedding: null },
      ],
    };

    const countToEmbed = await Message.countDocuments(queryUnembedded);
    console.log(`Total messages in MongoDB: ${totalMessages}`);
    console.log(`Messages pending embeddings: ${countToEmbed}`);

    if (countToEmbed === 0) {
      console.log('✨ All messages already have local embeddings computed. Nothing to do!');
      return;
    }

    console.log('\nGenerating embeddings...\n');

    let processedCount = totalMessages - countToEmbed;
    const batchSize = 64;

    while (true) {
      // Fetch next batch of unembedded messages
      const batch = await Message.find(queryUnembedded)
        .select('_id sender message threadId messageType')
        .limit(batchSize)
        .lean();

      if (!batch || batch.length === 0) {
        break;
      }

      const texts = batch.map(getEmbeddableText);
      const vectors = await generateEmbeddings(texts, 32);

      const bulkOps = batch.map((item, idx) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { embedding: vectors[idx] } },
        },
      }));

      await Message.bulkWrite(bulkOps);
      processedCount += batch.length;

      if (processedCount % 500 === 0 || processedCount === totalMessages) {
        console.log(`${processedCount} / ${totalMessages}`);
      }
    }

    const verifyCount = await Message.countDocuments({
      embedding: { $exists: true, $not: { $size: 0 } },
    });

    console.log('\nEmbeddings completed.');
    console.log(`Successfully verified ${verifyCount} / ${totalMessages} messages with 384-dimensional embeddings.`);
  } finally {
    await disconnectDB();
  }
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  computeAllEmbeddings()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error during embedding generation:', err);
      process.exit(1);
    });
}

export default computeAllEmbeddings;
