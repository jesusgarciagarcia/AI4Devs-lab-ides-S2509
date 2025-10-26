/**
 * CREATE CANDIDATE USE CASE - APPLICATION LAYER
 *
 * Caso de uso para crear un nuevo candidato
 * Orquesta la lógica de aplicación sin conocer detalles de infraestructura
 */

import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Email } from '../../domain/value-objects/Email';
import { Phone } from '../../domain/value-objects/Phone';

export interface CreateCandidateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  createdBy: string;
  cvPath?: string; // Optional CV path
}

export interface CreateCandidateResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateCandidateUseCase {
  constructor(private readonly candidateRepository: ICandidateRepository) {}

  async execute(
    request: CreateCandidateRequest,
  ): Promise<CreateCandidateResponse> {
    // 1. Validar email y teléfono usando Value Objects
    const email = Email.create(request.email);
    const phone = Phone.create(request.phone);

    // 2. Verificar que no exista un candidato con ese email
    const existingCandidate = await this.candidateRepository.findByEmail(
      email.getValue(),
    );
    if (existingCandidate && !existingCandidate.isDeleted) {
      throw new Error('CANDIDATE_ALREADY_EXISTS');
    }

    // 3. Crear entidad de dominio
    const candidate = Candidate.create({
      firstName: request.firstName,
      lastName: request.lastName,
      email: email.getValue(),
      phone: phone.getValue(),
      address: request.address,
      education: request.education,
      experience: request.experience,
      createdBy: request.createdBy,
    });

    // 4. Attach CV if provided
    if (request.cvPath) {
      const fileName =
        request.cvPath.split('/').pop() ||
        request.cvPath.split('\\').pop() ||
        'cv.pdf';
      // Determine mime type from file extension
      const mimeType = fileName.endsWith('.pdf')
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      candidate.attachCv(
        request.cvPath,
        fileName,
        mimeType,
        0, // Size will be set by the file system
      );
    }

    // 5. Persistir
    const savedCandidate = await this.candidateRepository.save(candidate);

    // 6. Retornar DTO
    return this.toResponse(savedCandidate);
  }

  private toResponse(candidate: Candidate): CreateCandidateResponse {
    return {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      address: candidate.address,
      education: candidate.education,
      experience: candidate.experience,
      status: candidate.status,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt,
    };
  }
}
