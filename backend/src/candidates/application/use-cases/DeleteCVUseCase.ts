/**
 * DELETE CV USE CASE - APPLICATION LAYER
 */

import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

export interface DeleteCVRequest {
  candidateId: string;
  userId: string;
}

export interface DeleteCVResponse {
  success: boolean;
  message: string;
  candidate: {
    id: string;
    fullName: string;
    updatedAt: Date;
  };
}

export class DeleteCVUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(request: DeleteCVRequest): Promise<DeleteCVResponse> {
    // Find existing candidate
    const candidate = await this.candidateRepository.findById(
      request.candidateId,
    );
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    // Verify ownership
    if (candidate.createdBy !== request.userId) {
      throw new Error(
        'Unauthorized: You can only delete CV from your own candidates',
      );
    }

    // Check if already deleted
    if (candidate.isDeleted) {
      throw new Error('Cannot delete CV from a deleted candidate');
    }

    // Check if candidate has CV
    if (!candidate.hasCv) {
      throw new Error('Candidate does not have a CV attached');
    }

    // Remove CV from candidate
    candidate.removeCv();

    // Persist the change
    const updated = await this.candidateRepository.save(candidate);

    return {
      success: true,
      message: 'CV successfully removed',
      candidate: {
        id: updated.id,
        fullName: updated.fullName,
        updatedAt: updated.updatedAt,
      },
    };
  }
}
