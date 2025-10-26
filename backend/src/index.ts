/**
 * Server Entry Point
 * Inicia el servidor Express y maneja el ciclo de vida
 */

import app from './app';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { prisma } from './config/database';

const PORT = config.PORT;

/**
 * Inicia el servidor
 */
const server = app.listen(PORT, () => {
  logger.info(`🚀 Backend Imparable! Servidor corriendo en puerto ${PORT}`, {
    environment: config.NODE_ENV,
    port: PORT,
  });
  logger.info(`📖 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔌 API Base: http://localhost:${PORT}/api/v1`);
});

/**
 * Manejo de errores no capturados
 */
process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason: reason.message,
    stack: reason.stack,
  });
  // En producción, considera cerrar el servidor gracefully
  if (config.NODE_ENV === 'production') {
    gracefulShutdown('Unhandled Rejection');
  }
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', {
    message: error.message,
    stack: error.stack,
  });
  // Cerrar el servidor inmediatamente
  gracefulShutdown('Uncaught Exception');
});

/**
 * Cierre graceful del servidor
 */
function gracefulShutdown(signal: string) {
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

  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
}

// Manejar señales de terminación
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
