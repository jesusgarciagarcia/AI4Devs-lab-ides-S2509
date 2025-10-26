/**
 * Authentication Middleware
 * Verifica JWT tokens y protege rutas
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { UnauthorizedError } from '../utils/errors';
import { ApiResponse } from '../utils/apiResponse';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Middleware de autenticación
 * Verifica el token JWT en el header Authorization
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // Extraer token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No se proporcionó token de autenticación');
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    // Agregar usuario a request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Token inválido'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Token expirado'));
    }
    next(error);
  }
};

/**
 * Middleware de autorización por roles
 * Verifica que el usuario tenga uno de los roles permitidos
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new UnauthorizedError('No tienes permisos para acceder a este recurso'),
      );
    }

    next();
  };
};

/**
 * Middleware opcional de autenticación
 * Agrega el usuario si el token es válido, pero no falla si no hay token
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // Ignorar errores de token en auth opcional
    next();
  }
};
