/**
 * DELETE CANDIDATE USE CASE - APPLICATION LAYER
 */

import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

export interface DeleteCandidateRequest {
  candidateId: string;
  userId: string;
}

export interface DeleteCandidateResponse {
  success: boolean;
  message: string;
  deletedAt: Date;
}

export class DeleteCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(
    request: DeleteCandidateRequest,
  ): Promise<DeleteCandidateResponse> {
    // Find existing candidate
    const candidate = await this.candidateRepository.findById(
      request.candidateId,
    );
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    // Verify ownership
    if (candidate.createdBy !== request.userId) {
      throw new Error('Unauthorized: You can only delete your own candidates');
    }

    // Check if already deleted
    if (candidate.isDeleted) {
      throw new Error('Candidate is already deleted');
    }

    // Perform soft delete
    candidate.delete();

    // Persist the change
    await this.candidateRepository.save(candidate);

    return {
      success: true,
      message: 'Candidate successfully deleted',
      deletedAt: candidate.deletedAt!,
    };
  }
}
