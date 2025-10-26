/**
 * CANDIDATE ROUTES - INFRASTRUCTURE LAYER
 *
 * Define las rutas HTTP para el módulo de candidatos
 */

import { Router } from 'express';
import { CandidateController } from './CandidateController';

export function createCandidateRoutes(controller: CandidateController): Router {
  const router = Router();

  // Create candidate
  router.post('/', (req, res, next) => controller.create(req, res, next));

  // Get candidate by ID
  router.get('/:id', (req, res, next) => controller.getById(req, res, next));

  // List candidates
  router.get('/', (req, res, next) => controller.list(req, res, next));

  // Update candidate
  router.put('/:id', (req, res, next) => controller.update(req, res, next));

  // Delete candidate
  router.delete('/:id', (req, res, next) => controller.delete(req, res, next));

  // Upload CV
  router.post('/:id/cv', (req, res, next) =>
    controller.uploadCV(req, res, next),
  );

  // Delete CV
  router.delete('/:id/cv', (req, res, next) =>
    controller.deleteCV(req, res, next),
  );

  return router;
}
