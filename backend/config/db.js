import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let memoryServerInstance = null;

/**
 * Connects to MongoDB using Mongoose.
 * 1. Attempts connection to the primary configured MONGO_URI (or localhost:27017).
 * 2. If the primary MongoDB is genuinely unavailable, gracefully falls back to an embedded
 *    MongoMemoryServer with persistent on-disk storage in backend/data/local-mongodb.
 */
export const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/group-chat-search';

  // 1. Try primary MongoDB connection
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ Primary MongoDB Connected: ${conn.connection.host}:${conn.connection.port || 27017}`);
    return true;
  } catch (primaryError) {
    console.warn(`ℹ️  Primary MongoDB not reachable at ${primaryUri} (${primaryError.message}).`);
    console.log('🔄 Initializing embedded persistent MongoDB instance...');

    // 2. Fallback to MongoMemoryServer with persistent dbPath
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const dbDir = path.resolve(__dirname, '../data/local-mongodb');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Try running on standard port 27017 or let it select available port
      try {
        memoryServerInstance = await MongoMemoryServer.create({
          instance: {
            dbPath: dbDir,
            port: 27017,
            storageEngine: 'wiredTiger',
          },
        });
      } catch (portErr) {
        // If 27017 is held or errored, create with dynamic port
        memoryServerInstance = await MongoMemoryServer.create({
          instance: {
            dbPath: dbDir,
            storageEngine: 'wiredTiger',
          },
        });
      }

      const memoryUri = memoryServerInstance.getUri() + 'group-chat-search';
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Embedded Persistent MongoDB Connected at: ${memoryUri}`);
      return true;
    } catch (fallbackError) {
      console.error('❌ Failed to start embedded MongoDB fallback:', fallbackError.message);
      return false;
    }
  }
};

/**
 * Cleanly disconnects from MongoDB and stops any embedded server instance.
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
      memoryServerInstance = null;
    }
    console.log('🔒 MongoDB connection cleanly closed.');
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err.message);
  }
};

export default connectDB;
