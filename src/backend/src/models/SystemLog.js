const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    level: {
      type: String,
      enum: ['info', 'warn', 'error'],
      default: 'info',
      index: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    }
  },
  {
    timestamps: false
  }
);

// Compound index for querying recent audit actions
systemLogSchema.index({ timestamp: -1, level: 1 });

module.exports = mongoose.model('SystemLog', systemLogSchema);

