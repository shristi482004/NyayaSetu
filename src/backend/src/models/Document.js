const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    fileSize: {
      type: Number,
      required: true,
      max: [26214400, 'File size cannot exceed 25MB']
    },
    mimeType: {
      type: String,
      required: true,
      default: 'application/pdf'
    },
    checksum: {
      type: String,
      required: true
    },
    storagePath: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['uploaded', 'extracting', 'ready', 'failed'],
      default: 'uploaded',
      index: true
    },
    pageCount: {
      type: Number,
      default: 0
    },
    errorMessage: {
      type: String,
      default: null
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: { createdAt: 'uploadDate', updatedAt: 'updatedAt' }
  }
);

// Compound index for efficient user document querying
documentSchema.index({ userId: 1, uploadDate: -1 });

module.exports = mongoose.model('Document', documentSchema);

