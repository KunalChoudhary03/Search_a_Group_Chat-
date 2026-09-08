import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
      index: true,
    },
    embedding: {
      type: [Number],
      default: [],
    },
    threadId: {
      type: String,
      index: true,
      default: null,
    },
    messageType: {
      type: String,
      enum: ['normal', 'short_reply', 'hinglish', 'typo', 'emoji', 'forwarded', 'decision'],
      default: 'normal',
      index: true,
    },
    externalId: {
      type: String,
      index: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal search filtering and chronological windowing
messageSchema.index({ timestamp: 1, sender: 1 });
messageSchema.index({ sender: 1, timestamp: -1 });
messageSchema.index({ threadId: 1, timestamp: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
