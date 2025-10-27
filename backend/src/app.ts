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

app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalRateLimiter);

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

const candidateRoutes = initCandidatesModule();
app.use('/api/v1/candidates', candidateRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
