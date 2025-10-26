/**
 * Standardized API Response Utility
 * Proporciona formato consistente para todas las respuestas de la API
 */

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export class ApiResponse {
  /**
   * Genera una respuesta de éxito estandarizada
   */
  static success<T>(data: T, message?: string): ApiSuccessResponse<T> {
    return {
      success: true,
      data,
      ...(message && { message }),
    };
  }

  /**
   * Genera una respuesta de error estandarizada
   */
  static error(code: string, message: string, details?: any): ApiErrorResponse {
    return {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    };
  }
}
