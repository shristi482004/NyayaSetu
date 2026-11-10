const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      default: 'Document Inquiry Thread',
      trim: true
    },
    lastActiveAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

chatSessionSchema.index({ userId: 1, documentId: 1 });

module.exports = mongoose.model('ChatSession', chatSessionSchema);

