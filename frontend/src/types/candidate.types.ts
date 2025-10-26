/**
 * Type definitions for Candidate entity
 * Following SOLID principles - Single Responsibility
 */

/**
 * Candidate entity representation
 */
export interface Candidate {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvFile?: File | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Candidate form data type (without id and timestamps)
 * Used for form submission
 */
export interface CandidateFormData
  extends Omit<Candidate, "id" | "createdAt" | "updatedAt"> {
  cvFile: File | null;
}

/**
 * Form step identifiers for wizard navigation
 */
export type FormStep =
  | "personal-info"
  | "address"
  | "education"
  | "experience"
  | "documents";

/**
 * Configuration for each form step
 */
export interface FormStepConfig {
  id: FormStep;
  title: string;
  description: string;
  fields: (keyof CandidateFormData)[];
}

/**
 * API response wrapper for candidate operations
 */
export interface CandidateApiResponse {
  success: boolean;
  data?: Candidate;
  error?: string;
  message?: string;
}

/**
 * Form submission state
 */
export type FormSubmissionState =
  | "idle"
  | "validating"
  | "submitting"
  | "success"
  | "error";

/**
 * File upload state
 */
export interface FileUploadState {
  file: File | null;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
}
