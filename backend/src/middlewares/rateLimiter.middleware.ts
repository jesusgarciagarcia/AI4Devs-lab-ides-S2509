/**
 * Rate Limiter Middleware
 * Protege la API contra abuso y ataques de fuerza bruta
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/environment';
import { ApiResponse } from '../utils/apiResponse';

/**
 * Rate limiter general para toda la API
 */
export const generalRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS, // 15 minutos por defecto
  max: config.RATE_LIMIT_MAX_REQUESTS, // 100 requests por defecto
  message: ApiResponse.error(
    'RATE_LIMIT_EXCEEDED',
    'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde',
  ),
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Personalizar el key generator para usar IP real detrás de proxy
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
  },
});

/**
 * Rate limiter estricto para rutas de autenticación
 * Previene ataques de fuerza bruta
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos
  message: ApiResponse.error(
    'RATE_LIMIT_EXCEEDED',
    'Demasiados intentos de autenticación. Por favor intenta de nuevo en 15 minutos',
  ),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar requests exitosos
});

/**
 * Rate limiter para upload de archivos
 * Previene abuso del almacenamiento
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // Máximo 20 uploads por hora
  message: ApiResponse.error(
    'RATE_LIMIT_EXCEEDED',
    'Demasiadas subidas de archivos. Por favor intenta de nuevo más tarde',
  ),
  standardHeaders: true,
  legacyHeaders: false,
});
