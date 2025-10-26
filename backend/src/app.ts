/**
 * Express Application Setup
 * Configuración central de la aplicación Express
 */

import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config/environment';
import { generalRateLimiter } from './middlewares/rateLimiter.middleware';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/errorHandler.middleware';
import { logger } from './utils/logger';
import { initCandidatesModule } from './candidates';

const app: Express = express();

// ==================== MIDDLEWARES GLOBALES ====================

// CORS - Configurar según necesidades
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  }),
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
app.use(generalRateLimiter);

// Request Logger (solo en desarrollo)
if (config.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
      query: req.query,
      body: req.body,
      ip: req.ip,
    });
    next();
  });
}

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '¡Backend Imparable! 🚀 - El API que Nunca Duerme',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      candidates: '/api/v1/candidates',
    },
  });
});

// ==================== API ROUTES ====================

// Initialize modules
const candidateRoutes = initCandidatesModule();

// V1 Routes
app.use('/api/v1/candidates', candidateRoutes);

// Future routes can be added here
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);

// ==================== ERROR HANDLERS ====================

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler (DEBE ser el último)
app.use(errorHandler);

export default app;
