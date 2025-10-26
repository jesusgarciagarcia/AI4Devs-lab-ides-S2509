/**
 * Candidate API Service
 * Handles all API calls related to candidates
 */

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3010/api/v1";

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  workExperience: string;
  cv?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCandidateDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  workExperience: string;
  cv?: File;
}

/**
 * Get all candidates from the API
 */
export const getCandidates = async (): Promise<Candidate[]> => {
  const response = await fetch(`${API_BASE_URL}/candidates`);

  if (!response.ok) {
    throw new Error(`Error fetching candidates: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data || json;
};

/**
 * Get a single candidate by ID
 */
export const getCandidateById = async (id: number): Promise<Candidate> => {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}`);

  if (!response.ok) {
    throw new Error(`Error fetching candidate: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data || json;
};

/**
 * Create a new candidate
 */
export const createCandidate = async (
  data: CreateCandidateDto
): Promise<Candidate> => {
  const formData = new FormData();

  formData.append("firstName", data.firstName);
  formData.append("lastName", data.lastName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("address", data.address);
  formData.append("education", data.education);
  formData.append("workExperience", data.workExperience);

  if (data.cv) {
    formData.append("cv", data.cv);
  }

  const response = await fetch(`${API_BASE_URL}/candidates`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error creating candidate: ${response.statusText}`
    );
  }

  const json = await response.json();
  return json.data || json;
};

/**
 * Delete a candidate by ID
 */
export const deleteCandidate = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Error deleting candidate: ${response.statusText}`);
  }
};
