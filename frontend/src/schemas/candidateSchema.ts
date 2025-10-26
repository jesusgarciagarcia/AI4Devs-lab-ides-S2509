/**
 * Zod validation schemas for candidate form
 * Implements RFC 5322 (email) and E.164 (phone) standards
 */

import { z } from "zod";

// Email validation according to RFC 5322 (simplified)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// International phone format E.164
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Only letters and common accents
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

/**
 * Main candidate validation schema
 * All fields validated according to business rules
 */
export const candidateSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .refine(
      (val) => val.length === 0 || nameRegex.test(val),
      "El nombre solo puede contener letras"
    )
    .transform((str) => str.trim()),

  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .refine(
      (val) => val.length === 0 || nameRegex.test(val),
      "El apellido solo puede contener letras"
    )
    .transform((str) => str.trim()),

  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingresa un correo válido")
    .regex(emailRegex, "Formato de correo inválido")
    .toLowerCase()
    .transform((str) => str.trim()),

  phone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(15, "El teléfono no puede exceder 15 dígitos")
    .regex(
      phoneRegex,
      "Formato de teléfono inválido (ejemplo: +34612345678 o +525512345678)"
    )
    .transform((str) => str.trim()),

  address: z
    .string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres")
    .transform((str) => str.trim()),

  education: z
    .string()
    .min(10, "La educación debe tener al menos 10 caracteres")
    .max(1000, "La educación no puede exceder 1000 caracteres")
    .transform((str) => str.trim()),

  experience: z
    .string()
    .min(10, "La experiencia debe tener al menos 10 caracteres")
    .max(2000, "La experiencia no puede exceder 2000 caracteres")
    .transform((str) => str.trim()),

  cvFile: z
    .instanceof(File, { message: "Debes subir un archivo" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "El archivo no puede superar 5MB"
    )
    .refine(
      (file) =>
        [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      "Solo se permiten archivos PDF o DOCX"
    )
    .nullable()
    .optional(),
});

/**
 * Infer TypeScript type from Zod schema
 * This ensures type safety between validation and TypeScript
 */
export type CandidateSchemaType = z.infer<typeof candidateSchema>;

/**
 * Partial schema for field-level validation
 * Used for real-time validation on blur
 */
export const createFieldSchema = (fieldName: keyof CandidateSchemaType) => {
  return candidateSchema.pick({ [fieldName]: true });
};

/**
 * Schema for CV file validation only
 */
export const cvFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "El archivo no puede superar 5MB"
  )
  .refine(
    (file) =>
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type),
    "Solo se permiten archivos PDF o DOCX"
  );

/**
 * Allowed file types for CV upload
 */
export const ALLOWED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
} as const;

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
