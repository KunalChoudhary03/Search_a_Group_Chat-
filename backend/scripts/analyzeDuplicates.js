import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../config/db.js';
import Message from '../models/Message.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export async function analyzeDuplicates() {
  const connected = await connectDB();
  if (!connected) {
    console.error('Could not connect to MongoDB for duplicate analysis.');
    process.exit(1);
  }

  try {
    const totalCount = await Message.countDocuments();
    if (totalCount === 0) {
      console.log('No messages found in MongoDB to analyze.');
      return { totalCount: 0, uniqueCount: 0, duplicatePercentage: '0.0' };
    }

    const messages = await Message.find({}, 'message sender timestamp').lean();

    const textFrequency = new Map();
    for (const msg of messages) {
      const text = (msg.message || '').trim();
      textFrequency.set(text, (textFrequency.get(text) || 0) + 1);
    }

    const uniqueCount = textFrequency.size;
    const duplicateCount = totalCount - uniqueCount;
    const duplicatePercentage = ((duplicateCount / totalCount) * 100).toFixed(2);

    // Sort by frequency descending
    const sorted = Array.from(textFrequency.entries()).sort((a, b) => b[1] - a[1]);
    const topRepeated = sorted.filter(([_, count]) => count > 1).slice(0, 10);

    console.log('\n============================================================');
    console.log('📊 DATASET DUPLICATE ANALYSIS REPORT');
    console.log('============================================================');
    console.log(`Total Messages:             ${totalCount}`);
    console.log(`Unique Message Texts:       ${uniqueCount}`);
    console.log(`Duplicate Message Texts:    ${duplicateCount}`);
    console.log(`Duplicate Percentage:       ${duplicatePercentage}%`);
    console.log('------------------------------------------------------------');
    console.log('Top Repeated Messages:');
    if (topRepeated.length === 0) {
      console.log('  None! All messages are completely unique.');
    } else {
      topRepeated.forEach(([text, count], idx) => {
        console.log(`  ${idx + 1}. [${count}x] "${text}"`);
      });
    }
    console.log('============================================================\n');

    return {
      totalCount,
      uniqueCount,
      duplicateCount,
      duplicatePercentage,
      topRepeated,
    };
  } finally {
    await disconnectDB();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  analyzeDuplicates()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Analysis failed:', err);
      process.exit(1);
    });
}

export default analyzeDuplicates;
