const mongoose = require('mongoose');
const config = require('./env');
const logger = require('./logger');

const connectDB = async (customUri) => {
  const uri = customUri || config.mongodbUri;
  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true
    });
    logger.info(`MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
    throw err;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed.');
  } catch (err) {
    logger.error(`Error closing MongoDB connection: ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB };

