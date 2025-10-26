/**
 * LIST CANDIDATES USE CASE - APPLICATION LAYER
 */

import { Candidate } from '../../domain/entities/Candidate';
import {
  ICandidateRepository,
  PaginationOptions,
  SearchCriteria,
} from '../../domain/repositories/ICandidateRepository';

export interface ListCandidatesRequest {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
  userId: string;
}

export interface CandidateListItem {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  cvUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListCandidatesResponse {
  data: CandidateListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class ListCandidatesUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(
    request: ListCandidatesRequest,
  ): Promise<ListCandidatesResponse> {
    const options: PaginationOptions = {
      page: request.page,
      limit: request.limit,
      sortBy: request.sortBy || 'createdAt',
      sortOrder: request.sortOrder || 'desc',
    };

    const criteria: SearchCriteria = {
      search: request.search,
      status: request.status,
      userId: request.userId,
    };

    const result = await this.candidateRepository.findAll(options, criteria);

    return {
      data: result.data.map(this.toListItem),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    };
  }

  private toListItem(candidate: Candidate): CandidateListItem {
    return {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      status: candidate.status,
      cvUrl: candidate.cvUrl,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}
