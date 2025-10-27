import { useState, useCallback } from "react";
import { z } from "zod";

interface UseFormValidationProps<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
}

interface UseFormValidationReturn {
  errors: Record<string, string>;
  isSubmitting: boolean;
  validateField: (fieldName: string, value: unknown) => Promise<boolean>;
  validateForm: (data: unknown) => Promise<boolean>;
  handleSubmit: (data: unknown) => Promise<void>;
  clearErrors: () => void;
  setFieldError: (fieldName: string, error: string) => void;
}

export function useFormValidation<T>({
  schema,
  onSubmit,
}: UseFormValidationProps<T>): UseFormValidationReturn {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    async (fieldName: string, value: unknown): Promise<boolean> => {
      try {
        await schema.parseAsync({ [fieldName]: value });
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

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

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
