import app from './app';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { prisma } from './config/database';

const SHUTDOWN_TIMEOUT_MS = 10000;

const server = app.listen(config.PORT, () => {
  logger.info(
    `🚀 Backend Imparable! Servidor corriendo en puerto ${config.PORT}`,
    {
      environment: config.NODE_ENV,
      port: config.PORT,
    },
  );
  logger.info(`📖 Health check: http://localhost:${config.PORT}/health`);
  logger.info(`🔌 API Base: http://localhost:${config.PORT}/api/v1`);
});

process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', {
    reason: reason.message,
    stack: reason.stack,
  });

  if (config.NODE_ENV === 'production') {
    gracefulShutdown('Unhandled Rejection');
  }
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', {
    message: error.message,
    stack: error.stack,
  });
  gracefulShutdown('Uncaught Exception');
});

function gracefulShutdown(signal: string): void {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await prisma.$disconnect();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown', { error });
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
