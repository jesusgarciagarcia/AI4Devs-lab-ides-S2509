import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { UnauthorizedError } from '../utils/errors';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

interface UserInfo {
  id: string;
  email: string;
  role: string;
}

const BEARER_PREFIX = 'Bearer ';
const TOKEN_START_INDEX = 7;

function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    return null;
  }
  return authHeader.substring(TOKEN_START_INDEX);
}

function verifyToken(token: string): UserInfo {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expirado');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Token inválido');
    }
    throw error;
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError('No se proporcionó token de autenticación');
    }

    req.user = verifyToken(token);
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new UnauthorizedError(
        'No tienes permisos para acceder a este recurso',
      );
    }

    next();
  };
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      req.user = verifyToken(token);
    }

    next();
  } catch (error) {
    next();
  }
};
