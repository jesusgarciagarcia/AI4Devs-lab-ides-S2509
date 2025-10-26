/**
 * UPDATE CANDIDATE USE CASE - APPLICATION LAYER
 */

import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Email } from '../../domain/value-objects/Email';
import { Phone } from '../../domain/value-objects/Phone';

export interface UpdateCandidateRequest {
  candidateId: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  education?: string;
  experience?: string;
}

export interface UpdateCandidateResponse {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string | null;
  education: string;
  experience: string;
  cvUrl: string | null;
  status: string;
  updatedAt: Date;
}

export class UpdateCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(
    request: UpdateCandidateRequest,
  ): Promise<UpdateCandidateResponse> {
    // Find existing candidate
    const candidate = await this.candidateRepository.findById(
      request.candidateId,
    );
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    // Verify ownership
    if (candidate.createdBy !== request.userId) {
      throw new Error('Unauthorized: You can only update your own candidates');
    }

    // Validate email if provided
    if (request.email && request.email !== candidate.email) {
      const emailVO = Email.create(request.email);

      // Check if new email is already in use
      const existingCandidate = await this.candidateRepository.findByEmail(
        emailVO.getValue(),
      );
      if (existingCandidate && existingCandidate.id !== candidate.id) {
        throw new Error('Email already in use by another candidate');
      }
    }

    // Validate phone if provided
    if (request.phone) {
      Phone.create(request.phone);
    }

    // Update personal information
    const updateData: any = {};
    if (request.firstName) updateData.firstName = request.firstName;
    if (request.lastName) updateData.lastName = request.lastName;
    if (request.phone) updateData.phone = request.phone;
    if (request.address !== undefined) updateData.address = request.address;
    if (request.education) updateData.education = request.education;
    if (request.experience) updateData.experience = request.experience;

    if (Object.keys(updateData).length > 0) {
      candidate.updatePersonalInfo(updateData);
    }

    // Update email separately if provided
    if (request.email && request.email !== candidate.email) {
      candidate.updateEmail(request.email);
    }

    // Save updated candidate
    const updated = await this.candidateRepository.save(candidate);

    return this.toResponse(updated);
  }

  private toResponse(candidate: Candidate): UpdateCandidateResponse {
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
      status: candidate.status,
      updatedAt: candidate.updatedAt,
    };
  }
}
