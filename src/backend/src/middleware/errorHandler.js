const logger = require('../config/logger');
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error on ${req.method} ${req.originalUrl}: ${err.message}`, {
    stack: err.stack,
    body: req.body,
    userId: req.user ? req.user.id : null
  });

  // Handle Multer file size limit
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'Payload Too Large',
        message: 'The uploaded file exceeds the 25MB maximum limit.'
      });
    }
    return res.status(400).json({
      success: false,
      error: 'Upload Error',
      message: err.message
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: `Resource not found with format: ${err.value}`
    });
  }

  // Handle MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      error: 'Conflict',
      message: `Duplicate value for ${field}. A record with this ${field} already exists.`
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : (process.env.NODE_ENV === 'production' ? 'An unexpected internal server error occurred.' : err.message);

  return res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: message
  });
};

module.exports = errorHandler;

