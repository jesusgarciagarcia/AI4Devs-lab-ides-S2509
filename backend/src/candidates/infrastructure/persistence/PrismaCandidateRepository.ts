/**
 * PRISMA CANDIDATE REPOSITORY - INFRASTRUCTURE LAYER
 *
 * Implementación con Prisma del repositorio de candidatos
 * Requiere PostgreSQL y Docker funcionando
 */

import { PrismaClient } from '@prisma/client';
import { Candidate, CandidateStatus } from '../../domain/entities/Candidate';
import {
  ICandidateRepository,
  PaginationOptions,
  SearchCriteria,
  PaginatedResult,
} from '../../domain/repositories/ICandidateRepository';

export class PrismaCandidateRepository implements ICandidateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(candidate: Candidate): Promise<Candidate> {
    const data = {
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      education: candidate.education,
      experience: candidate.experience,
      cvUrl: candidate.cvUrl,
      cvFileName: candidate.cvFileName,
      cvMimeType: candidate.cvMimeType,
      cvSize: candidate.cvSize,
      status: candidate.status,
      createdBy: candidate.createdBy,
      updatedAt: candidate.updatedAt,
      deletedAt: candidate.deletedAt,
    };

    const existing = await this.prisma.candidate.findUnique({
      where: { id: candidate.id },
    });

    let saved;
    if (existing) {
      saved = await this.prisma.candidate.update({
        where: { id: candidate.id },
        data,
      });
    } else {
      // Use unchecked create to bypass relations
      saved = await this.prisma.candidate.create({
        data: {
          id: candidate.id,
          createdAt: candidate.createdAt,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          phone: candidate.phone,
          address: candidate.address,
          education: candidate.education,
          experience: candidate.experience,
          cvUrl: candidate.cvUrl,
          cvFileName: candidate.cvFileName,
          cvMimeType: candidate.cvMimeType,
          cvSize: candidate.cvSize,
          status: candidate.status,
          createdBy: candidate.createdBy,
          updatedAt: candidate.updatedAt,
          deletedAt: candidate.deletedAt,
        },
      });
    }

    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Candidate | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
    });

    if (!candidate || candidate.deletedAt !== null) {
      return null;
    }

    return this.toDomain(candidate);
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { email },
    });

    if (!candidate || candidate.deletedAt !== null) {
      return null;
    }

    return this.toDomain(candidate);
  }

  async findAll(
    options: PaginationOptions,
    criteria?: SearchCriteria,
  ): Promise<PaginatedResult<Candidate>> {
    const where: any = {
      deletedAt: null,
    };

    if (criteria) {
      if (criteria.userId) {
        where.createdBy = criteria.userId;
      }

      if (criteria.status) {
        where.status = criteria.status;
      }

      if (criteria.search) {
        where.OR = [
          { firstName: { contains: criteria.search, mode: 'insensitive' } },
          { lastName: { contains: criteria.search, mode: 'insensitive' } },
          { email: { contains: criteria.search, mode: 'insensitive' } },
          { phone: { contains: criteria.search } },
        ];
      }
    }

    const [total, candidates] = await Promise.all([
      this.prisma.candidate.count({ where }),
      this.prisma.candidate.findMany({
        where,
        skip: (options.page - 1) * options.limit,
        take: options.limit,
        orderBy: {
          [options.sortBy || 'createdAt']: options.sortOrder || 'desc',
        },
      }),
    ]);

    const totalPages = Math.ceil(total / options.limit);

    return {
      data: candidates.map((c) => this.toDomain(c)),
      page: options.page,
      limit: options.limit,
      total,
      totalPages,
      hasNextPage: options.page < totalPages,
      hasPrevPage: options.page > 1,
    };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.candidate.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async count(criteria?: SearchCriteria): Promise<number> {
    const where: any = {
      deletedAt: null,
    };

    if (criteria) {
      if (criteria.userId) {
        where.createdBy = criteria.userId;
      }

      if (criteria.status) {
        where.status = criteria.status;
      }

      if (criteria.search) {
        where.OR = [
          { firstName: { contains: criteria.search, mode: 'insensitive' } },
          { lastName: { contains: criteria.search, mode: 'insensitive' } },
          { email: { contains: criteria.search, mode: 'insensitive' } },
        ];
      }
    }

    return this.prisma.candidate.count({ where });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.candidate.count({
      where: {
        email,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  private toDomain(raw: any): Candidate {
    return Candidate.fromPersistence({
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone,
      address: raw.address,
      education: raw.education,
      experience: raw.experience,
      cvUrl: raw.cvUrl,
      cvFileName: raw.cvFileName,
      cvMimeType: raw.cvMimeType,
      cvSize: raw.cvSize,
      status: raw.status as CandidateStatus,
      createdBy: raw.createdBy,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }
}
