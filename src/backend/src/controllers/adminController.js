const User = require('../models/User');
const SystemLog = require('../models/SystemLog');
const auditService = require('../services/auditService');

const listUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const targetUserId = req.params.id;

    if (targetUserId === req.user.id && status === 'suspended') {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Administrators cannot suspend their own active account.'
      });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found.'
      });
    }

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    await auditService.logEvent({
      userId: req.user.id,
      action: 'ADMIN_UPDATE_USER_STATUS',
      level: 'warn',
      details: { targetUserId: user._id, oldStatus, newStatus: status }
    });

    return res.status(200).json({
      success: true,
      data: user,
      message: `User account status updated to ${status}.`
    });
  } catch (err) {
    next(err);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.level) filter.level = req.query.level;
    if (req.query.action) filter.action = req.query.action;

    const [logs, total] = await Promise.all([
      SystemLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit),
      SystemLog.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUsers,
  updateUserStatus,
  getAuditLogs
};

