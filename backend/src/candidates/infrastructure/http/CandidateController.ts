/**
 * CANDIDATE CONTROLLER - INFRASTRUCTURE LAYER
 *
 * Controlador HTTP que maneja las peticiones REST
 * Coordina con los casos de uso de la capa de aplicación
 */

import { Request, Response, NextFunction } from 'express';
import {
  CreateCandidateUseCase,
  GetCandidateUseCase,
  ListCandidatesUseCase,
  UpdateCandidateUseCase,
  DeleteCandidateUseCase,
  UploadCVUseCase,
  DeleteCVUseCase,
} from '../../application/use-cases';

export class CandidateController {
  constructor(
    private readonly createCandidateUseCase: CreateCandidateUseCase,
    private readonly getCandidateUseCase: GetCandidateUseCase,
    private readonly listCandidatesUseCase: ListCandidatesUseCase,
    private readonly updateCandidateUseCase: UpdateCandidateUseCase,
    private readonly deleteCandidateUseCase: DeleteCandidateUseCase,
    private readonly uploadCVUseCase: UploadCVUseCase,
    private readonly deleteCVUseCase: DeleteCVUseCase,
  ) {}

  /**
   * POST /api/candidates
   * Create a new candidate
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('📝 Creating candidate with body:', req.body);
      console.log('📎 File uploaded:', req.file);

      const userId = (req as any).user?.id || 'system';
      const cvFile = req.file; // Multer adds the file to req.file

      // Validate required fields
      const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'address',
        'education',
      ];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          console.error(`❌ Missing required field: ${field}`);
          return next(new Error(`Missing required field: ${field}`));
        }
      }

      // Map frontend field names to backend field names
      const requestData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        education: req.body.education,
        experience: req.body.workExperience || req.body.experience, // Accept both field names
        createdBy: userId,
        cvPath: cvFile?.path, // Add CV path if file was uploaded
      };

      // Ensure experience is not undefined
      if (!requestData.experience) {
        console.error('❌ Missing experience field');
        return next(
          new Error('Missing required field: workExperience or experience'),
        );
      }

      console.log('✅ Request data:', requestData);

      const response = await this.createCandidateUseCase.execute(requestData);

      console.log('🎉 Candidate created successfully:', response);

      res.status(201).json({
        success: true,
        data: response,
      });
    } catch (error) {
      console.error('❌ Error creating candidate:', error);
      next(error);
    }
  }

  /**
   * GET /api/candidates/:id
   * Get candidate by ID
   */
  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';

      const response = await this.getCandidateUseCase.execute({
        id: req.params.id,
        userId,
      });

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/candidates
   * List candidates with pagination and filters
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc';
      const search = req.query.search as string;
      const status = req.query.status as string;

      const response = await this.listCandidatesUseCase.execute({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        status,
        userId,
      });

      res.status(200).json({
        success: true,
        ...response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/candidates/:id
   * Update candidate
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';

      const response = await this.updateCandidateUseCase.execute({
        candidateId: req.params.id,
        userId,
        ...req.body,
      });

      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/candidates/:id
   * Delete candidate (soft delete)
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';

      const response = await this.deleteCandidateUseCase.execute({
        candidateId: req.params.id,
        userId,
      });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/candidates/:id/cv
   * Upload CV for candidate
   */
  async uploadCV(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const file = (req as any).file;

      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
        return;
      }

      const response = await this.uploadCVUseCase.execute({
        candidateId: req.params.id,
        userId,
        cvUrl: file.path || file.location,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/candidates/:id/cv
   * Delete CV from candidate
   */
  async deleteCV(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';

      const response = await this.deleteCVUseCase.execute({
        candidateId: req.params.id,
        userId,
      });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
