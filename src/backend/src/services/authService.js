const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auditService = require('./auditService');

class AuthService {
  /**
   * Registers a new citizen or lawyer account.
   */
  async register({ name, email, password, role = 'citizen' }, ipAddress = null) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const err = new Error('An account with this email address is already registered.');
      err.statusCode = 409;
      err.isOperational = true;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'citizen',
      status: 'active'
    });

    await auditService.logEvent({
      userId: user._id,
      action: 'AUTH_REGISTER',
      level: 'info',
      details: { email: user.email, role: user.role },
      ipAddress
    });

    const token = user.generateJWT();

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }
    };
  }

  /**
   * Authenticates user credentials and issues a signed JWT token.
   */
  async login({ email, password }, ipAddress = null) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      await auditService.logEvent({
        action: 'AUTH_LOGIN_FAILED',
        level: 'warn',
        details: { email: email.toLowerCase(), reason: 'User not found' },
        ipAddress
      });
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.isOperational = true;
      throw err;
    }

    if (user.status === 'suspended') {
      await auditService.logEvent({
        userId: user._id,
        action: 'AUTH_LOGIN_BLOCKED',
        level: 'warn',
        details: { reason: 'Suspended account attempt' },
        ipAddress
      });
      const err = new Error('This account has been suspended. Please contact administrator.');
      err.statusCode = 403;
      err.isOperational = true;
      throw err;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await auditService.logEvent({
        userId: user._id,
        action: 'AUTH_LOGIN_FAILED',
        level: 'warn',
        details: { email: user.email, reason: 'Password mismatch' },
        ipAddress
      });
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.isOperational = true;
      throw err;
    }

    await auditService.logEvent({
      userId: user._id,
      action: 'AUTH_LOGIN_SUCCESS',
      level: 'info',
      details: { role: user.role },
      ipAddress
    });

    const token = user.generateJWT();

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    };
  }
}

module.exports = new AuthService();

