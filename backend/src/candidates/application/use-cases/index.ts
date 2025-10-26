/**
 * APPLICATION USE CASES - BARREL FILE
 *
 * Exporta todos los casos de uso de la capa de aplicación
 */

export { CreateCandidateUseCase } from './CreateCandidateUseCase';
export type {
  CreateCandidateRequest,
  CreateCandidateResponse,
} from './CreateCandidateUseCase';

export { GetCandidateUseCase } from './GetCandidateUseCase';
export type {
  GetCandidateRequest,
  GetCandidateResponse,
} from './GetCandidateUseCase';

export { ListCandidatesUseCase } from './ListCandidatesUseCase';
export type {
  ListCandidatesRequest,
  ListCandidatesResponse,
  CandidateListItem,
} from './ListCandidatesUseCase';

export { UpdateCandidateUseCase } from './UpdateCandidateUseCase';
export type {
  UpdateCandidateRequest,
  UpdateCandidateResponse,
} from './UpdateCandidateUseCase';

export { DeleteCandidateUseCase } from './DeleteCandidateUseCase';
export type {
  DeleteCandidateRequest,
  DeleteCandidateResponse,
} from './DeleteCandidateUseCase';

export { UploadCVUseCase } from './UploadCVUseCase';
export type { UploadCVRequest, UploadCVResponse } from './UploadCVUseCase';

export { DeleteCVUseCase } from './DeleteCVUseCase';
export type { DeleteCVRequest, DeleteCVResponse } from './DeleteCVUseCase';
