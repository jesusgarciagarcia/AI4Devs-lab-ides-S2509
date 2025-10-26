/**
 * Custom hook for form validation using Zod schemas
 * Implements Single Responsibility Principle - only handles validation logic
 */

import { useState, useCallback } from "react";
import { z } from "zod";

/**
 * Props for useFormValidation hook
 */
interface UseFormValidationProps<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
}

/**
 * Return type for useFormValidation hook
 */
interface UseFormValidationReturn {
  errors: Record<string, string>;
  isSubmitting: boolean;
  validateField: (fieldName: string, value: unknown) => Promise<boolean>;
  validateForm: (data: unknown) => Promise<boolean>;
  handleSubmit: (data: unknown) => Promise<void>;
  clearErrors: () => void;
  setFieldError: (fieldName: string, error: string) => void;
}

/**
 * Hook for form validation with Zod
 * Provides field-level and form-level validation
 *
 * @param schema - Zod validation schema
 * @param onSubmit - Callback function to execute on successful validation
 *
 * @example
 * const { errors, validateField, handleSubmit } = useFormValidation({
 *   schema: candidateSchema,
 *   onSubmit: async (data) => {
 *     await api.createCandidate(data);
 *   }
 * });
 */
export function useFormValidation<T>({
  schema,
  onSubmit,
}: UseFormValidationProps<T>): UseFormValidationReturn {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   * Called on blur or onChange for real-time validation
   */
  const validateField = useCallback(
    async (fieldName: string, value: unknown): Promise<boolean> => {
      try {
        // Validate against full schema with partial data
        await schema.parseAsync({ [fieldName]: value });

        // Clear error for this field
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });

        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.issues.find(
            (e: z.ZodIssue) => e.path[0] === fieldName
          );
          if (fieldError) {
            setErrors((prev) => ({
              ...prev,
              [fieldName]: fieldError.message,
            }));
          }
        }
        return false;
      }
    },
    [schema]
  );

  /**
   * Validate entire form
   * Called before submission
   */
  const validateForm = useCallback(
    async (data: unknown): Promise<boolean> => {
      try {
        await schema.parseAsync(data);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formattedErrors: Record<string, string> = {};
          error.issues.forEach((err: z.ZodIssue) => {
            const fieldName = err.path[0] as string;
            if (fieldName) {
              formattedErrors[fieldName] = err.message;
            }
          });
          setErrors(formattedErrors);
        }
        return false;
      }
    },
    [schema]
  );

  /**
   * Handle form submission with validation
   * Prevents submission if validation fails
   */
  const handleSubmit = useCallback(
    async (data: unknown) => {
      setIsSubmitting(true);
      try {
        const isValid = await validateForm(data);
        if (isValid) {
          await onSubmit(data as T);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, onSubmit]
  );

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Set error for specific field (for server-side validation)
   */
  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  return {
    errors,
    isSubmitting,
    validateField,
    validateForm,
    handleSubmit,
    clearErrors,
    setFieldError,
  };
}
