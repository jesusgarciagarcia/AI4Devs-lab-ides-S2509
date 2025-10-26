/**
 * CANDIDATE ENTITY - DOMAIN LAYER
 *
 * Entidad de dominio que representa un Candidato
 * Contiene la lógica de negocio y reglas de dominio
 */

export interface CandidateProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvUrl?: string | null;
  cvFileName?: string | null;
  cvMimeType?: string | null;
  cvSize?: number | null;
  status: CandidateStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export enum CandidateStatus {
  NEW = 'NEW',
  IN_REVIEW = 'IN_REVIEW',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INTERVIEWED = 'INTERVIEWED',
  OFFER_EXTENDED = 'OFFER_EXTENDED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export class Candidate {
  private constructor(private readonly props: CandidateProps) {}

  // Factory method
  static create(
    props: Omit<
      CandidateProps,
      'id' | 'createdAt' | 'updatedAt' | 'status' | 'deletedAt'
    >,
  ): Candidate {
    return new Candidate({
      ...props,
      id: this.generateId(),
      status: CandidateStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  // Reconstruct from persistence
  static fromPersistence(props: CandidateProps): Candidate {
    return new Candidate(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get address(): string {
    return this.props.address;
  }

  get education(): string {
    return this.props.education;
  }

  get experience(): string {
    return this.props.experience;
  }

  get cvUrl(): string | null {
    return this.props.cvUrl || null;
  }

  get cvFileName(): string | null {
    return this.props.cvFileName || null;
  }

  get cvMimeType(): string | null {
    return this.props.cvMimeType || null;
  }

  get cvSize(): number | null {
    return this.props.cvSize || null;
  }

  get status(): CandidateStatus {
    return this.props.status;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt || null;
  }

  get isDeleted(): boolean {
    return this.props.deletedAt !== null && this.props.deletedAt !== undefined;
  }

  get hasCv(): boolean {
    return this.props.cvUrl !== null && this.props.cvUrl !== undefined;
  }

  // Business logic methods
  updatePersonalInfo(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    education?: string;
    experience?: string;
  }): void {
    if (data.firstName) this.props.firstName = data.firstName;
    if (data.lastName) this.props.lastName = data.lastName;
    if (data.phone) this.props.phone = data.phone;
    if (data.address) this.props.address = data.address;
    if (data.education) this.props.education = data.education;
    if (data.experience) this.props.experience = data.experience;
    this.props.updatedAt = new Date();
  }

  updateEmail(newEmail: string): void {
    this.props.email = newEmail;
    this.props.updatedAt = new Date();
  }

  attachCv(
    cvUrl: string,
    fileName: string,
    mimeType: string,
    size: number,
  ): void {
    this.props.cvUrl = cvUrl;
    this.props.cvFileName = fileName;
    this.props.cvMimeType = mimeType;
    this.props.cvSize = size;
    this.props.updatedAt = new Date();
  }

  removeCv(): void {
    this.props.cvUrl = null;
    this.props.cvFileName = null;
    this.props.cvMimeType = null;
    this.props.cvSize = null;
    this.props.updatedAt = new Date();
  }

  changeStatus(newStatus: CandidateStatus): void {
    this.props.status = newStatus;
    this.props.updatedAt = new Date();
  }

  delete(): void {
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  // Conversión a objeto plano
  toObject(): CandidateProps {
    return { ...this.props };
  }

  // Helper para generar IDs (en producción usar UUID library)
  private static generateId(): string {
    return `cand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
