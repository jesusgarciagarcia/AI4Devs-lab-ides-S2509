/**
 * UPLOAD CV USE CASE - APPLICATION LAYER
 */

import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

export interface UploadCVRequest {
  candidateId: string;
  userId: string;
  cvUrl: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface UploadCVResponse {
  success: boolean;
  message: string;
  candidate: {
    id: string;
    fullName: string;
    cvUrl: string;
    cvFileName: string;
    cvMimeType: string;
    cvSize: number;
    updatedAt: Date;
  };
}

export class UploadCVUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(request: UploadCVRequest): Promise<UploadCVResponse> {
    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimeTypes.includes(request.mimeType)) {
      throw new Error(
        'Invalid file type. Only PDF and DOC/DOCX files are allowed',
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (request.size > maxSize) {
      throw new Error('File size exceeds maximum allowed size of 5MB');
    }

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
        'Unauthorized: You can only upload CV for your own candidates',
      );
    }

    // Check if already deleted
    if (candidate.isDeleted) {
      throw new Error('Cannot upload CV for a deleted candidate');
    }

    // Attach CV to candidate
    candidate.attachCv(
      request.cvUrl,
      request.fileName,
      request.mimeType,
      request.size,
    );

    // Persist the change
    const updated = await this.candidateRepository.save(candidate);

    return {
      success: true,
      message: 'CV successfully uploaded',
      candidate: {
        id: updated.id,
        fullName: updated.fullName,
        cvUrl: updated.cvUrl!,
        cvFileName: updated.cvFileName!,
        cvMimeType: updated.cvMimeType!,
        cvSize: updated.cvSize!,
        updatedAt: updated.updatedAt,
      },
    };
  }
}
