/**
 * Custom hook for form data persistence in localStorage
 * Implements auto-save and draft recovery functionality
 */

import { useState, useEffect, useCallback } from "react";
import { CandidateFormData } from "../types/candidate.types";

/**
 * Props for useFormPersistence hook
 */
interface UseFormPersistenceProps {
  storageKey: string;
  autoSaveInterval?: number; // milliseconds
}

/**
 * Return type for useFormPersistence hook
 */
interface UseFormPersistenceReturn<T> {
  savedData: T | null;
  saveData: (data: T) => void;
  clearSavedData: () => void;
  hasSavedData: boolean;
  lastSaved: Date | null;
}

/**
 * Hook for persisting form data in localStorage
 * Provides auto-save functionality and draft recovery
 *
 * @param storageKey - Unique key for localStorage
 * @param autoSaveInterval - Auto-save interval in ms (optional)
 *
 * @example
 * const { savedData, saveData, clearSavedData } = useFormPersistence({
 *   storageKey: 'candidate-form-draft',
 *   autoSaveInterval: 30000, // 30 seconds
 * });
 */
export function useFormPersistence<T = CandidateFormData>({
  storageKey,
  autoSaveInterval,
}: UseFormPersistenceProps): UseFormPersistenceReturn<T> {
  const [savedData, setSavedData] = useState<T | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);

  /**
   * Load saved data from localStorage on mount
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedData(parsed.data);
        setLastSaved(parsed.timestamp ? new Date(parsed.timestamp) : null);
        setHasSavedData(true);
      }
    } catch (error) {
      console.error("Error loading saved form data:", error);
    }
  }, [storageKey]);

  /**
   * Save data to localStorage
   */
  const saveData = useCallback(
    (data: T) => {
      try {
        const dataToSave = {
          data,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        setSavedData(data);
        setLastSaved(new Date());
        setHasSavedData(true);
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    },
    [storageKey]
  );

  /**
   * Clear saved data from localStorage
   */
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setSavedData(null);
      setLastSaved(null);
      setHasSavedData(false);
    } catch (error) {
      console.error("Error clearing saved form data:", error);
    }
  }, [storageKey]);

  return {
    savedData,
    saveData,
    clearSavedData,
    hasSavedData,
    lastSaved,
  };
}

/**
 * Format last saved time for display
 */
export function formatLastSaved(date: Date | null): string {
  if (!date) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Guardado hace unos segundos";
  if (diffMins === 1) return "Guardado hace 1 minuto";
  if (diffMins < 60) return `Guardado hace ${diffMins} minutos`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return "Guardado hace 1 hora";
  if (diffHours < 24) return `Guardado hace ${diffHours} horas`;

  return `Guardado el ${date.toLocaleDateString()}`;
}
