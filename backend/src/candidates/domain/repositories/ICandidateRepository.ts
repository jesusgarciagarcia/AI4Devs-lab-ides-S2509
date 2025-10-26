/**
 * CANDIDATE REPOSITORY INTERFACE - DOMAIN LAYER
 *
 * Define el contrato que deben implementar los repositorios
 * Esta es la abstracción del puerto de salida (output port)
 */

import { Candidate } from '../entities/Candidate';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchCriteria {
  search?: string;
  status?: string;
  userId?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Repository Interface
 * Los adaptadores de infraestructura implementarán esta interfaz
 */
export interface ICandidateRepository {
  /**
   * Guarda un candidato (crear o actualizar)
   */
  save(candidate: Candidate): Promise<Candidate>;

  /**
   * Busca un candidato por ID
   */
  findById(id: string): Promise<Candidate | null>;

  /**
   * Busca un candidato por email
   */
  findByEmail(email: string): Promise<Candidate | null>;

  /**
   * Lista candidatos con paginación y filtros
   */
  findAll(
    options: PaginationOptions,
    criteria?: SearchCriteria,
  ): Promise<PaginatedResult<Candidate>>;

  /**
   * Elimina un candidato (soft delete en dominio)
   */
  delete(id: string): Promise<boolean>;

  /**
   * Cuenta candidatos por criterios
   */
  count(criteria?: SearchCriteria): Promise<number>;

  /**
   * Verifica si existe un candidato por email
   */
  existsByEmail(email: string): Promise<boolean>;
}
