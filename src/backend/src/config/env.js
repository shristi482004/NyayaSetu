const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nyayasetu',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_nyayasetu_jwt_key_minimum_32_characters_long',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  aiInternalApiKey: process.env.AI_INTERNAL_API_KEY || 'internal_secret_development_token',
  maxFileSizeBytes: parseInt(process.env.MAX_FILE_SIZE_BYTES, 10) || 26214400, // 25MB
  uploadDir: path.resolve(__dirname, '../../uploads'),
  corsOrigin: process.env.CORS_ORIGIN
    ? (process.env.CORS_ORIGIN.includes(',')
        ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
        : process.env.CORS_ORIGIN)
    : '*'
};

module.exports = config;

