/**
 * INTEGRATION TESTS - Use Cases (Application Layer)
 *
 * Tests de integración con PrismaCandidateRepository y base de datos real
 */

import { PrismaClient } from '@prisma/client';
import { PrismaCandidateRepository } from '../infrastructure/persistence/PrismaCandidateRepository';
import { CreateCandidateUseCase } from '../application/use-cases/CreateCandidateUseCase';
import { GetCandidateUseCase } from '../application/use-cases/GetCandidateUseCase';
import { ListCandidatesUseCase } from '../application/use-cases/ListCandidatesUseCase';
import { UpdateCandidateUseCase } from '../application/use-cases/UpdateCandidateUseCase';
import { DeleteCandidateUseCase } from '../application/use-cases/DeleteCandidateUseCase';

describe('Candidates Module - Integration Tests with Prisma', () => {
  let prisma: PrismaClient;
  let repository: PrismaCandidateRepository;
  let createUseCase: CreateCandidateUseCase;
  let getUseCase: GetCandidateUseCase;
  let listUseCase: ListCandidatesUseCase;
  let updateUseCase: UpdateCandidateUseCase;
  let deleteUseCase: DeleteCandidateUseCase;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new PrismaCandidateRepository(prisma);
    createUseCase = new CreateCandidateUseCase(repository);
    getUseCase = new GetCandidateUseCase(repository);
    listUseCase = new ListCandidatesUseCase(repository);
    updateUseCase = new UpdateCandidateUseCase(repository);
    deleteUseCase = new DeleteCandidateUseCase(repository);
  });

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada test
    await prisma.candidate.deleteMany({});
    await prisma.user.deleteMany({});

    // Crear usuarios de prueba
    await prisma.user.create({
      data: {
        id: 'user123',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      },
    });

    await prisma.user.create({
      data: {
        id: 'different-user',
        email: 'different@example.com',
        password: 'hashedpassword',
        name: 'Different User',
      },
    });
  });

  afterAll(async () => {
    // Limpiar y desconectar después de todos los tests
    await prisma.candidate.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('CreateCandidateUseCase', () => {
    it('should create a new candidate successfully', async () => {
      const request = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        education: 'Computer Science Degree',
        experience: '5 years as Software Engineer',
        createdBy: 'user123',
      };

      const response = await createUseCase.execute(request);

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.firstName).toBe('John');
      expect(response.lastName).toBe('Doe');
      expect(response.email).toBe('john.doe@example.com');
      expect(response.status).toBe('NEW');
    });

    it('should throw error for invalid email', async () => {
      const request = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '+1234567890',
        address: '123 Main St',
        education: 'Computer Science Degree',
        experience: '5 years as Software Engineer',
        createdBy: 'user123',
      };

      await expect(createUseCase.execute(request)).rejects.toThrow(
        'Invalid email format',
      );
    });

    it('should throw error for invalid phone', async () => {
      const request = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: 'invalid-phone',
        address: '123 Main St',
        education: 'Computer Science Degree',
        experience: '5 years as Software Engineer',
        createdBy: 'user123',
      };

      await expect(createUseCase.execute(request)).rejects.toThrow(
        'Invalid phone format',
      );
    });

    it('should throw error for duplicate email', async () => {
      const request = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        education: 'Computer Science Degree',
        experience: '5 years as Software Engineer',
        createdBy: 'user123',
      };

      await createUseCase.execute(request);
      await expect(createUseCase.execute(request)).rejects.toThrow(
        'CANDIDATE_ALREADY_EXISTS',
      );
    });
  });

  describe('GetCandidateUseCase', () => {
    it('should retrieve a candidate by id', async () => {
      const created = await createUseCase.execute({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567890',
        address: '456 Oak Ave',
        education: 'MBA',
        experience: '10 years in management',
        createdBy: 'user123',
      });

      const response = await getUseCase.execute({
        id: created.id,
        userId: 'user123',
      });

      expect(response).toBeDefined();
      expect(response.id).toBe(created.id);
      expect(response.firstName).toBe('Jane');
      expect(response.lastName).toBe('Smith');
    });

    it('should throw error for non-existent candidate', async () => {
      await expect(
        getUseCase.execute({
          id: 'non-existent-id',
          userId: 'user123',
        }),
      ).rejects.toThrow('CANDIDATE_NOT_FOUND');
    });
  });

  describe('ListCandidatesUseCase', () => {
    it('should list candidates with pagination', async () => {
      await createUseCase.execute({
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        phone: '+1111111111',
        address: 'Address 1',
        education: 'Education 1',
        experience: 'Experience 1',
        createdBy: 'user123',
      });

      await createUseCase.execute({
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bob@example.com',
        phone: '+2222222222',
        address: 'Address 2',
        education: 'Education 2',
        experience: 'Experience 2',
        createdBy: 'user123',
      });

      const response = await listUseCase.execute({
        page: 1,
        limit: 10,
        userId: 'user123',
      });

      expect(response).toBeDefined();
      expect(response.data).toHaveLength(2);
      expect(response.pagination.total).toBe(2);
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.totalPages).toBe(1);
    });

    it('should filter candidates by search term', async () => {
      await createUseCase.execute({
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie@example.com',
        phone: '+3333333333',
        address: 'Address 3',
        education: 'Education 3',
        experience: 'Experience 3',
        createdBy: 'user123',
      });

      await createUseCase.execute({
        firstName: 'David',
        lastName: 'Miller',
        email: 'david@example.com',
        phone: '+4444444444',
        address: 'Address 4',
        education: 'Education 4',
        experience: 'Experience 4',
        createdBy: 'user123',
      });

      const response = await listUseCase.execute({
        page: 1,
        limit: 10,
        search: 'Charlie',
        userId: 'user123',
      });

      expect(response.data).toHaveLength(1);
      expect(response.data[0].firstName).toBe('Charlie');
    });

    it('should paginate results correctly', async () => {
      // Create 5 candidates
      for (let i = 1; i <= 5; i++) {
        await createUseCase.execute({
          firstName: `User${i}`,
          lastName: 'Test',
          email: `user${i}@example.com`,
          phone: `+${i}000000000`,
          address: `Address ${i}`,
          education: 'Education',
          experience: 'Experience',
          createdBy: 'user123',
        });
      }

      // Get first page (2 items)
      const page1 = await listUseCase.execute({
        page: 1,
        limit: 2,
        userId: 'user123',
      });

      expect(page1.data).toHaveLength(2);
      expect(page1.pagination.totalPages).toBe(3);
      expect(page1.pagination.hasNextPage).toBe(true);
      expect(page1.pagination.hasPrevPage).toBe(false);

      // Get second page
      const page2 = await listUseCase.execute({
        page: 2,
        limit: 2,
        userId: 'user123',
      });

      expect(page2.data).toHaveLength(2);
      expect(page2.pagination.hasNextPage).toBe(true);
      expect(page2.pagination.hasPrevPage).toBe(true);
    });
  });

  describe('UpdateCandidateUseCase', () => {
    it('should update candidate information', async () => {
      const created = await createUseCase.execute({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Old Address',
        education: 'Old Education',
        experience: 'Old Experience',
        createdBy: 'user123',
      });

      const updated = await updateUseCase.execute({
        candidateId: created.id,
        userId: 'user123',
        firstName: 'Johnny',
        address: 'New Address',
      });

      expect(updated.firstName).toBe('Johnny');
      expect(updated.lastName).toBe('Doe'); // Unchanged
      expect(updated.address).toBe('New Address');
      expect(updated.education).toBe('Old Education'); // Unchanged
    });

    it('should throw error when updating non-owned candidate', async () => {
      const created = await createUseCase.execute({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Address',
        education: 'Education',
        experience: 'Experience',
        createdBy: 'user123',
      });

      await expect(
        updateUseCase.execute({
          candidateId: created.id,
          userId: 'different-user',
          firstName: 'Hacker',
        }),
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('DeleteCandidateUseCase', () => {
    it('should soft delete candidate', async () => {
      const created = await createUseCase.execute({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Address',
        education: 'Education',
        experience: 'Experience',
        createdBy: 'user123',
      });

      const deleted = await deleteUseCase.execute({
        candidateId: created.id,
        userId: 'user123',
      });

      expect(deleted.success).toBe(true);
      expect(deleted.deletedAt).toBeDefined();

      // Verify candidate is not accessible
      await expect(
        getUseCase.execute({
          id: created.id,
          userId: 'user123',
        }),
      ).rejects.toThrow('CANDIDATE_NOT_FOUND');
    });

    it('should throw error when deleting non-owned candidate', async () => {
      const created = await createUseCase.execute({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: 'Address',
        education: 'Education',
        experience: 'Experience',
        createdBy: 'user123',
      });

      await expect(
        deleteUseCase.execute({
          candidateId: created.id,
          userId: 'different-user',
        }),
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('PrismaCandidateRepository Operations', () => {
    it('should handle full CRUD cycle', async () => {
      // Create
      const created = await createUseCase.execute({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+5555555555',
        address: 'Test Address',
        education: 'Test Education',
        experience: 'Test Experience',
        createdBy: 'user123',
      });

      expect(created.id).toBeDefined();

      // Read
      const candidate = await repository.findById(created.id);
      expect(candidate).toBeDefined();
      expect(candidate!.email).toBe('test@example.com');

      // Count
      const count = await repository.count();
      expect(count).toBe(1);

      // Exists
      const exists = await repository.existsByEmail('test@example.com');
      expect(exists).toBe(true);

      // Delete
      const deleted = await repository.delete(created.id);
      expect(deleted).toBe(true);

      // Verify soft delete
      const afterDelete = await repository.findById(created.id);
      expect(afterDelete).toBeNull();

      // Count should be 0 after delete
      const countAfterDelete = await repository.count();
      expect(countAfterDelete).toBe(0);
    });

    it('should support email uniqueness check', async () => {
      await createUseCase.execute({
        firstName: 'First',
        lastName: 'User',
        email: 'unique@example.com',
        phone: '+1111111111',
        address: 'Address',
        education: 'Education',
        experience: 'Experience',
        createdBy: 'user123',
      });

      const exists = await repository.existsByEmail('unique@example.com');
      expect(exists).toBe(true);

      const notExists = await repository.existsByEmail(
        'nonexistent@example.com',
      );
      expect(notExists).toBe(false);
    });
  });
});
