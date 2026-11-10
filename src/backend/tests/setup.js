const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

let mongoServer;

jest.setTimeout(60000);

const setupTestDB = () => {
  beforeAll(async () => {
    const testUri = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/nyayasetu_test';
    try {
      await mongoose.connect(testUri, { serverSelectionTimeoutMS: 2000 });
    } catch (err) {
      mongoServer = await MongoMemoryServer.create({ binary: { version: '7.0.14' } });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    }
  }, 60000);

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }

    // Clean up temporary files in uploads directory
    const uploadsDir = path.join(__dirname, '../uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        if (file.endsWith('.pdf') || file.endsWith('.tmp')) {
          try {
            fs.unlinkSync(path.join(uploadsDir, file));
          } catch (e) {
            // Ignore if file was already removed
          }
        }
      }
    }
  }, 60000);
};

module.exports = { setupTestDB };
