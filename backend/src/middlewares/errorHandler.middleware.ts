/**
 * Error Handler Middleware
 * Maneja todos los errores de la aplicación de forma centralizada
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { Prisma } from '@prisma/client';

/**
 * Middleware global de manejo de errores
 * Debe ser el último middleware en la cadena
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Log del error
  logger.error('Error capturado:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    user: req.user?.id,
  });

  // Errores controlados (AppError)
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json(ApiResponse.error(error.code, error.message, error.details));
    return;
  }

  // Errores de Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    handlePrismaError(error, res);
    return;
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    res
      .status(400)
      .json(
        ApiResponse.error(
          'VALIDATION_ERROR',
          'Error de validación en la base de datos',
        ),
      );
    return;
  }

  // Errores de sintaxis JSON
  if (error instanceof SyntaxError && 'body' in error) {
    res
      .status(400)
      .json(
        ApiResponse.error(
          'INVALID_JSON',
          'El cuerpo de la solicitud contiene JSON inválido',
        ),
      );
    return;
  }

  // Errores no controlados
  res
    .status(500)
    .json(
      ApiResponse.error(
        'INTERNAL_SERVER_ERROR',
        process.env.NODE_ENV === 'production'
          ? 'Error interno del servidor'
          : error.message,
      ),
    );
};

/**
 * Maneja errores específicos de Prisma
 */
function handlePrismaError(
  error: Prisma.PrismaClientKnownRequestError,
  res: Response,
): void {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const target = (error.meta?.target as string[]) || [];
      res
        .status(409)
        .json(
          ApiResponse.error(
            'DUPLICATE_ENTRY',
            `Ya existe un registro con ese ${target.join(', ')}`,
            { fields: target },
          ),
        );
      break;

    case 'P2025':
      // Record not found
      res
        .status(404)
        .json(ApiResponse.error('NOT_FOUND', 'Registro no encontrado'));
      break;

    case 'P2003':
      // Foreign key constraint failed
      res
        .status(400)
        .json(
          ApiResponse.error(
            'INVALID_REFERENCE',
            'Referencia inválida a otro registro',
          ),
        );
      break;

    case 'P2014':
      // Invalid ID
      res.status(400).json(ApiResponse.error('INVALID_ID', 'ID inválido'));
      break;

    default:
      res
        .status(500)
        .json(ApiResponse.error('DATABASE_ERROR', 'Error en la base de datos'));
  }
}

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res
    .status(404)
    .json(
      ApiResponse.error(
        'NOT_FOUND',
        `Ruta no encontrada: ${req.method} ${req.url}`,
      ),
    );
};
