import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../../utils/errors';
import { logger } from '../../../utils/logger';
import {
  CreateCandidateUseCase,
  GetCandidateUseCase,
  ListCandidatesUseCase,
  UpdateCandidateUseCase,
  DeleteCandidateUseCase,
  UploadCVUseCase,
  DeleteCVUseCase,
} from '../../application/use-cases';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

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

  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id || 'system';
      const uploadedFile = req.file;

      const candidateData = this.buildCandidateRequest(
        req.body,
        userId,
        uploadedFile,
      );
      const createdCandidate =
        await this.createCandidateUseCase.execute(candidateData);

      logger.info('Candidate created successfully', {
        candidateId: createdCandidate.id,
        email: createdCandidate.email,
        userId,
      });

      res.status(201).json({
        success: true,
        data: createdCandidate,
      });
    } catch (error) {
      logger.error('Error creating candidate', { error, userId: req.user?.id });
      next(error);
    }
  }

  private buildCandidateRequest(
    body: any,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const experience = body.workExperience || body.experience;

    if (!experience) {
      throw new BadRequestError(
        'Missing required field: experience or workExperience',
      );
    }

    return {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      education: body.education,
      experience,
      createdBy: userId,
      cvPath: file?.path,
    };
  }

  async getById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id || 'system';
      const candidate = await this.getCandidateUseCase.execute({
        id: req.params.id,
        userId,
      });

      res.status(200).json({
        success: true,
        data: candidate,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id || 'system';
      const paginationParams = this.extractPaginationParams(req.query);

      const paginatedCandidates = await this.listCandidatesUseCase.execute({
        ...paginationParams,
        userId,
      });

      res.status(200).json({
        success: true,
        ...paginatedCandidates,
      });
    } catch (error) {
      next(error);
    }
  }

  private extractPaginationParams(query: any) {
    return {
      page: parseInt(query.page as string) || 1,
      limit: parseInt(query.limit as string) || 10,
      sortBy: query.sortBy as string,
      sortOrder: query.sortOrder as 'asc' | 'desc',
      search: query.search as string,
      status: query.status as string,
    };
  }

  async update(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id || 'system';
      const updatedCandidate = await this.updateCandidateUseCase.execute({
        candidateId: req.params.id,
        userId,
        ...req.body,
      });

      res.status(200).json({
        success: true,
        data: updatedCandidate,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id || 'system';
      const deletionResult = await this.deleteCandidateUseCase.execute({
        candidateId: req.params.id,
        userId,
      });

      res.status(200).json(deletionResult);
    } catch (error) {
      next(error);
    }
  }

  async uploadCV(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id || 'system';
      const uploadedFile = req.file;

      if (!uploadedFile) {
        throw new BadRequestError('No file uploaded');
      }

      const cvData = this.extractFileData(uploadedFile);
      const uploadResult = await this.uploadCVUseCase.execute({
        candidateId: req.params.id,
        userId,
        ...cvData,
      });

      res.status(200).json(uploadResult);
    } catch (error) {
      next(error);
    }
  }

  private extractFileData(file: Express.Multer.File) {
    return {
      cvUrl: file.path || (file as any).location,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteCV(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id || 'system';
      const deletionResult = await this.deleteCVUseCase.execute({
        candidateId: req.params.id,
        userId,
      });

      res.status(200).json(deletionResult);
    } catch (error) {
      next(error);
    }
  }
}
