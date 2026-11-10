const SystemLog = require('../models/SystemLog');
const logger = require('../config/logger');

class AuditService {
  /**
   * Log an operational or security event to the SystemLogs MongoDB collection.
   */
  async logEvent({ userId = null, action, level = 'info', details = {}, ipAddress = null, userAgent = null }) {
    try {
      await SystemLog.create({
        timestamp: new Date(),
        userId,
        action,
        level,
        details,
        ipAddress,
        userAgent
      });
    } catch (err) {
      logger.error(`Failed to record audit log: ${err.message}`, { action, userId });
    }
  }
}

module.exports = new AuditService();

