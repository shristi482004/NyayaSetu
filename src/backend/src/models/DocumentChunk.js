const mongoose = require('mongoose');

const documentChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true
    },
    pageNumber: {
      type: Number,
      required: true
    },
    chunkIndex: {
      type: Number,
      required: true
    },
    textContent: {
      type: String,
      required: true
    },
    charCount: {
      type: Number,
      default: 0
    },
    isOcrApplied: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound index for ordered page retrieval
documentChunkSchema.index({ documentId: 1, pageNumber: 1 });

module.exports = mongoose.model('DocumentChunk', documentChunkSchema);

