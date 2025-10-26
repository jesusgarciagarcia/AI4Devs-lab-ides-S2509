/**
 * DEPENDENCY INJECTION CONTAINER
 *
 * Configura e inyecta las dependencias del módulo de candidatos
 * Usa Prisma para persistencia en PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { PrismaCandidateRepository } from '../persistence/PrismaCandidateRepository';
import {
  CreateCandidateUseCase,
  GetCandidateUseCase,
  ListCandidatesUseCase,
  UpdateCandidateUseCase,
  DeleteCandidateUseCase,
  UploadCVUseCase,
  DeleteCVUseCase,
} from '../../application/use-cases';
import { CandidateController } from '../http/CandidateController';

export class CandidateDIContainer {
  private static instance: CandidateDIContainer;
  private repository: ICandidateRepository;
  private controller: CandidateController;
  private prisma: PrismaClient;

  private constructor() {
    console.log('🗄️  Using Prisma Candidate Repository with PostgreSQL');
    this.prisma = new PrismaClient();
    this.repository = new PrismaCandidateRepository(this.prisma);

    // Initialize use cases
    const createUseCase = new CreateCandidateUseCase(this.repository);
    const getUseCase = new GetCandidateUseCase(this.repository);
    const listUseCase = new ListCandidatesUseCase(this.repository);
    const updateUseCase = new UpdateCandidateUseCase(this.repository);
    const deleteUseCase = new DeleteCandidateUseCase(this.repository);
    const uploadCVUseCase = new UploadCVUseCase(this.repository);
    const deleteCVUseCase = new DeleteCVUseCase(this.repository);

    // Initialize controller
    this.controller = new CandidateController(
      createUseCase,
      getUseCase,
      listUseCase,
      updateUseCase,
      deleteUseCase,
      uploadCVUseCase,
      deleteCVUseCase,
    );
  }

  static getInstance(): CandidateDIContainer {
    if (!CandidateDIContainer.instance) {
      CandidateDIContainer.instance = new CandidateDIContainer();
    }
    return CandidateDIContainer.instance;
  }

  getRepository(): ICandidateRepository {
    return this.repository;
  }

  getController(): CandidateController {
    return this.controller;
  }

  getPrisma(): PrismaClient {
    return this.prisma;
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
