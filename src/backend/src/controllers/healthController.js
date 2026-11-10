const mongoose = require('mongoose');
const Document = require('../models/Document');
const ChatSession = require('../models/ChatSession');
const aiServiceClient = require('../services/aiServiceClient');

const getHealthStatus = async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const aiHealth = await aiServiceClient.getHealth();

  const isHealthy = dbState === 1 && aiHealth.status === 'healthy';

  return res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    service: 'nyayasetu-backend',
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date(),
    components: {
      database: {
        status: dbStatusMap[dbState] || 'unknown',
        readyState: dbState
      },
      aiService: aiHealth
    }
  });
};

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [totalDocs, recentDocs, totalChats] = await Promise.all([
      Document.countDocuments({ userId }),
      Document.find({ userId }).sort({ uploadDate: -1 }).limit(5),
      ChatSession.countDocuments({ userId })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
        stats: {
          totalDocuments: totalDocs,
          totalChatSessions: totalChats
        },
        recentDocuments: recentDocs
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHealthStatus,
  getDashboard
};

