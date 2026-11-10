const authService = require('../services/authService');
const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await authService.register(req.body, ipAddress);
    return res.status(201).json({
      success: true,
      data: result,
      message: 'Account registered successfully.'
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await authService.login(req.body, ipAddress);
    return res.status(200).json({
      success: true,
      data: result,
      message: 'Authentication successful.'
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User profile not found.'
      });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.profile.phone = req.body.phone;
    if (req.body.organization) user.profile.organization = req.body.organization;
    if (req.body.barRegistrationNumber) user.profile.barRegistrationNumber = req.body.barRegistrationNumber;

    await user.save();

    return res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};

