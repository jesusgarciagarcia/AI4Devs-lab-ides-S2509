/**
 * GET CANDIDATE USE CASE - APPLICATION LAYER
 */

import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

export interface GetCandidateRequest {
  id: string;
  userId: string;
}

export interface GetCandidateResponse {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvUrl: string | null;
  cvFileName: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(request: GetCandidateRequest): Promise<GetCandidateResponse> {
    const candidate = await this.candidateRepository.findById(request.id);

    if (!candidate) {
      throw new Error('CANDIDATE_NOT_FOUND');
    }

    if (candidate.isDeleted) {
      throw new Error('CANDIDATE_NOT_FOUND');
    }

    // Verificar permisos
    if (candidate.createdBy !== request.userId) {
      throw new Error('FORBIDDEN');
    }

    return this.toResponse(candidate);
  }

  private toResponse(candidate: Candidate): GetCandidateResponse {
    return {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      education: candidate.education,
      experience: candidate.experience,
      cvUrl: candidate.cvUrl,
      cvFileName: candidate.cvFileName,
      status: candidate.status,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}
