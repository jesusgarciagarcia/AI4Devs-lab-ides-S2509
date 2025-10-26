/**
 * CANDIDATE ROUTES - INFRASTRUCTURE LAYER
 *
 * Define las rutas HTTP para el módulo de candidatos
 */

import { Router, Request, Response, NextFunction } from 'express';
import { CandidateController } from './CandidateController';
import {
  uploadCV,
  handleMulterError,
} from '../../../middlewares/fileUpload.middleware';

export function createCandidateRoutes(controller: CandidateController): Router {
  const router = Router();

  // Create candidate with optional CV upload
  router.post(
    '/',
    uploadCV.single('cv'),
    handleMulterError,
    (req: Request, res: Response, next: NextFunction) =>
      controller.create(req, res, next),
  );

  // Get candidate by ID
  router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
    controller.getById(req, res, next),
  );

  // List candidates
  router.get('/', (req: Request, res: Response, next: NextFunction) =>
    controller.list(req, res, next),
  );

  // Update candidate
  router.put('/:id', (req: Request, res: Response, next: NextFunction) =>
    controller.update(req, res, next),
  );

  // Delete candidate
  router.delete('/:id', (req: Request, res: Response, next: NextFunction) =>
    controller.delete(req, res, next),
  );

  // Upload CV
  router.post('/:id/cv', (req: Request, res: Response, next: NextFunction) =>
    controller.uploadCV(req, res, next),
  );

  // Delete CV
  router.delete('/:id/cv', (req: Request, res: Response, next: NextFunction) =>
    controller.deleteCV(req, res, next),
  );

  return router;
}
