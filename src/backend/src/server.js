const app = require('./app');
const config = require('./config/env');
const { connectDB, disconnectDB } = require('./config/database');
const logger = require('./config/logger');

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      logger.info(`NyayaSetu Backend Gateway running on port ${config.port} in [${config.nodeEnv}] mode.`);
      logger.info(`API endpoints reachable at: http://localhost:${config.port}${config.apiPrefix}`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} signal received: closing HTTP server and database connection.`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;

