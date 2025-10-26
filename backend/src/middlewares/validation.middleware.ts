/**
 * Validation Middleware
 * Valida request data usando esquemas Zod
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiResponse } from '../utils/apiResponse';

/**
 * Middleware de validación genérico
 * @param schema - Schema de Zod para validar
 * @param source - Parte del request a validar ('body', 'query', 'params')
 */
export const validate = (
  schema: z.ZodSchema,
  source: 'body' | 'query' | 'params' = 'body',
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar la fuente especificada
      const dataToValidate = req[source];

      // Parse y validación
      const validated = await schema.parseAsync(dataToValidate);

      // Reemplazar con datos validados y sanitizados
      req[source] = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formatear errores de Zod
        const errors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res
          .status(400)
          .json(
            ApiResponse.error(
              'VALIDATION_ERROR',
              'Error de validación en los datos enviados',
              errors,
            ),
          );
      }
      next(error);
    }
  };
};

/**
 * Middleware específico para validar body
 */
export const validateBody = (schema: z.ZodSchema) => {
  return validate(schema, 'body');
};

/**
 * Middleware específico para validar query params
 */
export const validateQuery = (schema: z.ZodSchema) => {
  return validate(schema, 'query');
};

/**
 * Middleware específico para validar params
 */
export const validateParams = (schema: z.ZodSchema) => {
  return validate(schema, 'params');
};
