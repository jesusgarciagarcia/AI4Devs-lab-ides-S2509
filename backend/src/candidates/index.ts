/**
 * CANDIDATES MODULE - MAIN ENTRY POINT
 *
 * Exporta lo necesario para integrar el módulo de candidatos en la aplicación
 */

import { Router } from 'express';
import { CandidateDIContainer } from './infrastructure/di/container';
import { createCandidateRoutes } from './infrastructure/http/candidateRoutes';

/**
 * Inicializa y retorna el router del módulo de candidatos
 */
export function initCandidatesModule(): Router {
  const container = CandidateDIContainer.getInstance();
  const controller = container.getController();
  const router = createCandidateRoutes(controller);

  return router;
}

// Export types and classes if needed elsewhere
export { CandidateDIContainer } from './infrastructure/di/container';
export type { ICandidateRepository } from './domain/repositories/ICandidateRepository';
export { Candidate, CandidateStatus } from './domain/entities/Candidate';
