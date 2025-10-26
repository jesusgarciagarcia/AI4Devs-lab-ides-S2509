/**
 * UNIT TESTS - Candidate Entity (Domain Layer)
 *
 * Tests para verificar la lógica de negocio de la entidad Candidate
 */

import { Candidate, CandidateStatus } from '../domain/entities/Candidate';

describe('Candidate Entity - Domain Tests', () => {
  describe('Factory Methods', () => {
    it('should create a new candidate with create() factory', () => {
      const candidate = Candidate.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        education: 'Computer Science',
        experience: '5 years',
        createdBy: 'user123',
      });

      expect(candidate).toBeDefined();
      expect(candidate.id).toBeDefined();
      expect(candidate.firstName).toBe('John');
      expect(candidate.lastName).toBe('Doe');
      expect(candidate.fullName).toBe('John Doe');
      expect(candidate.status).toBe(CandidateStatus.NEW);
      expect(candidate.isDeleted).toBe(false);
    });

    it('should reconstruct candidate from persistence', () => {
      const props = {
        id: 'test-id-123',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+9876543210',
        address: '456 Oak Ave',
        education: 'MBA',
        experience: '10 years',
        status: CandidateStatus.IN_REVIEW,
        createdBy: 'user456',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-06-01'),
        deletedAt: null,
      };

      const candidate = Candidate.fromPersistence(props);

      expect(candidate.id).toBe('test-id-123');
      expect(candidate.status).toBe(CandidateStatus.IN_REVIEW);
      expect(candidate.createdAt).toEqual(new Date('2023-01-01'));
    });
  });

  describe('Business Logic - updatePersonalInfo', () => {
    it('should update personal information', () => {
      const candidate = Candidate.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Old Address',
        education: 'Old Education',
        experience: 'Old Experience',
        createdBy: 'user123',
      });

      const originalUpdatedAt = candidate.updatedAt;

      // Wait a bit to ensure timestamp changes
      candidate.updatePersonalInfo({
        firstName: 'Johnny',
        address: 'New Address',
        education: 'New Education',
      });

      expect(candidate.firstName).toBe('Johnny');
      expect(candidate.lastName).toBe('Doe'); // Unchanged
      expect(candidate.address).toBe('New Address');
      expect(candidate.education).toBe('New Education');
      expect(candidate.experience).toBe('Old Experience'); // Unchanged
      expect(candidate.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe('Business Logic - CV Management', () => {
    it('should attach CV to candidate', () => {
      const candidate = Candidate.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Address',
        education: 'Education',
        experience: 'Experience',
        createdBy: 'user123',
      });

      expect(candidate.hasCv).toBe(false);

      candidate.attachCv(
        '/uploads/cv-123.pdf',
        'john-doe-cv.pdf',
        'application/pdf',
        102400,
      );

      expect(candidate.hasCv).toBe(true);
      expect(candidate.cvUrl).toBe('/uploads/cv-123.pdf');
      expect(candidate.cvFileName).toBe('john-doe-cv.pdf');
      expect(candidate.cvMimeType).toBe('application/pdf');
      expect(candidate.cvSize).toBe(102400);
    });

    it('should remove CV from candidate', () => {
      const candidate = Candidate.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Address',
        education: 'Education',
        experience: 'Experience',
        createdBy: 'user123',
      });

      candidate.attachCv('/uploads/cv.pdf', 'cv.pdf', 'application/pdf', 1024);
      expect(candidate.hasCv).toBe(true);

      candidate.removeCv();

      expect(candidate.hasCv).toBe(false);
      expect(candidate.cvUrl).toBeNull();
      expect(candidate.cvFileName).toBeNull();
      expect(candidate.cvMimeType).toBeNull();
      expect(candidate.cvSize).toBeNull();
    });
  });

  describe('Business Logic - Status Management', () => {
    it('should change candidate status', () => {
      const candidate = Candidate.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Address',
        education: 'Education',
        experience: 'Experience',
        createdBy: 'user123',
      });

      expect(candidate.status).toBe(CandidateStatus.NEW);

      candidate.changeStatus(CandidateStatus.IN_REVIEW);
      expect(candidate.status).toBe(CandidateStatus.IN_REVIEW);

      candidate.changeStatus(CandidateStatus.INTERVIEWED);
      expect(candidate.status).toBe(CandidateStatus.INTERVIEWED);
    });
  });

  describe('Business Logic - Soft Delete', () => {
    it('should soft delete candidate', () => {
      const candidate = Candidate.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Address',
        education: 'Education',
        experience: 'Experience',
        createdBy: 'user123',
      });

      expect(candidate.isDeleted).toBe(false);
      expect(candidate.deletedAt).toBeNull();

      candidate.delete();

      expect(candidate.isDeleted).toBe(true);
      expect(candidate.deletedAt).toBeDefined();
      expect(candidate.deletedAt).not.toBeNull();
    });
  });

  describe('Getters', () => {
    it('should return full name', () => {
      const candidate = Candidate.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Address',
        education: 'Education',
        experience: 'Experience',
        createdBy: 'user123',
      });

      expect(candidate.fullName).toBe('John Doe');
    });

    it('should serialize to plain object', () => {
      const candidate = Candidate.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Address',
        education: 'Education',
        experience: 'Experience',
        createdBy: 'user123',
      });

      const obj = candidate.toObject();

      expect(obj).toHaveProperty('id');
      expect(obj).toHaveProperty('firstName', 'John');
      expect(obj).toHaveProperty('lastName', 'Doe');
      expect(obj).toHaveProperty('email');
      expect(obj).toHaveProperty('status');
      expect(obj).toHaveProperty('createdAt');
    });
  });
});
