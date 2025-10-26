/**
 * Custom hook for file upload functionality
 * Handles file selection, validation, progress tracking
 */

import { useState, useCallback } from "react";
import {
  cvFileSchema,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from "../schemas/candidateSchema";
import { z } from "zod";

/**
 * Return type for useFileUpload hook
 */
interface UseFileUploadReturn {
  file: File | null;
  uploadProgress: number;
  error: string | null;
  isUploading: boolean;
  handleFileSelect: (file: File) => void;
  handleFileRemove: () => void;
  resetUpload: () => void;
}

/**
 * Hook for handling file uploads with validation and progress tracking
 *
 * @example
 * const { file, error, handleFileSelect, handleFileRemove } = useFileUpload();
 *
 * <input
 *   type="file"
 *   onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
 * />
 */
export function useFileUpload(): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Validate file before accepting it
   */
  const validateFile = useCallback((selectedFile: File): boolean => {
    try {
      cvFileSchema.parse(selectedFile);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || "Archivo inválido");
      } else {
        setError("Error al validar el archivo");
      }
      return false;
    }
  }, []);

  /**
   * Handle file selection
   * Validates file and simulates upload progress
   */
  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      // Reset previous state
      setError(null);
      setUploadProgress(0);

      // Validate file
      if (!validateFile(selectedFile)) {
        return;
      }

      // Set file and simulate upload progress
      setFile(selectedFile);
      setIsUploading(true);

      // Simulate upload progress (in production, use real upload with progress)
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
        }
      }, 100);
    },
    [validateFile]
  );

  /**
   * Remove uploaded file
   */
  const handleFileRemove = useCallback(() => {
    setFile(null);
    setUploadProgress(0);
    setError(null);
    setIsUploading(false);
  }, []);

  /**
   * Reset all upload state
   */
  const resetUpload = useCallback(() => {
    handleFileRemove();
  }, [handleFileRemove]);

  return {
    file,
    uploadProgress,
    error,
    isUploading,
    handleFileSelect,
    handleFileRemove,
    resetUpload,
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Check if file type is allowed
 */
export function isFileTypeAllowed(file: File): boolean {
  return Object.keys(ALLOWED_FILE_TYPES).includes(file.type);
}
