/**
 * Validadores personalizados para datos complejos
 */

// Email validation según RFC 5322 (simplificado pero efectivo)
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Teléfono internacional E.164 format
export const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Nombres (permite letras, espacios, guiones, apóstrofes y caracteres acentuados)
export const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

/**
 * Valida si un email tiene formato válido
 */
export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

/**
 * Valida si un teléfono tiene formato E.164
 */
export function isValidPhone(phone: string): boolean {
  return phoneRegex.test(phone);
}

/**
 * Valida si un nombre contiene solo caracteres permitidos
 */
export function isValidName(name: string): boolean {
  return nameRegex.test(name);
}

/**
 * Sanitiza un string eliminando caracteres peligrosos
 */
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, '') // Eliminar < y > para prevenir XSS básico
    .substring(0, 10000); // Límite de seguridad
}

/**
 * Valida si un archivo tiene extensión permitida
 */
export function isAllowedFileType(
  filename: string,
  allowedExtensions: string[],
): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

/**
 * Convierte bytes a formato legible
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
