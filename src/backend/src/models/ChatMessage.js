const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: true,
      index: true
    },
    senderRole: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    citedPages: [
      {
        type: Number
      }
    ],
    confidence: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'High'
    },
    isUnknown: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);

