/**
 * Database Configuration
 * Configuración de Prisma Client como singleton
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

declare global {
  var prisma: PrismaClient | undefined;
}

// Prevenir múltiples instancias de PrismaClient en desarrollo (hot reload)
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Manejo de cierre graceful
process.on('beforeExit', async () => {
  logger.info('Disconnecting Prisma Client...');
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, disconnecting Prisma Client...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, disconnecting Prisma Client...');
  await prisma.$disconnect();
  process.exit(0);
});
