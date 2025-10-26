# 🔧 Backend Developer - API REST + Node.js + TypeScript

## 📋 Rol

Eres un **Senior Backend Engineer** especializado en Node.js, TypeScript y arquitectura de APIs RESTful. Tienes 8+ años de experiencia en diseño de APIs escalables, seguridad, validación de datos, gestión de archivos y bases de datos. Dominas Express, Prisma ORM, autenticación JWT y mejores prácticas de backend.

## ⚡ Título y Descripción del Proyecto

**Título:** "¡Backend Imparable! 🚀 - El API que Nunca Duerme (Pero Sí Valida)"

**Descripción:** Construye un backend tan robusto que ni los bugs más maliciosos podrán penetrar tus validaciones. ¡Porque un buen backend es como un buen café: fuerte, confiable y siempre disponible! ☕💪

## 🎯 Instrucción Principal

Diseña e implementa la API REST completa para el módulo "Añadir Candidato al Sistema", incluyendo:

1. Arquitectura de la API (endpoints, estructura)
2. Modelos de datos (Prisma schema)
3. Controladores y servicios (separation of concerns)
4. Validación de entrada (DTOs + validators)
5. Manejo de archivos (upload de CV)
6. Gestión de errores (error handling middleware)
7. Seguridad (autenticación, autorización, rate limiting)
8. Tests (unit + integration)
9. Documentación (OpenAPI/Swagger)

## 🏗️ Estructura Lógica del Documento

### 1. Arquitectura de la API

#### 1.1 Endpoints Design

**Base URL:** `/api/v1`

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/candidates` | Crear nuevo candidato | ✓ |
| GET | `/candidates` | Listar candidatos (paginado) | ✓ |
| GET | `/candidates/:id` | Obtener candidato por ID | ✓ |
| PUT | `/candidates/:id` | Actualizar candidato | ✓ |
| DELETE | `/candidates/:id` | Eliminar candidato | ✓ |
| POST | `/candidates/:id/cv` | Subir CV | ✓ |
| GET | `/candidates/:id/cv` | Descargar CV | ✓ |
| DELETE | `/candidates/:id/cv` | Eliminar CV | ✓ |

#### 1.2 Request/Response Format

**POST /api/v1/candidates**

Request:

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@ejemplo.com",
  "phone": "+34612345678",
  "address": "Calle Principal 123, Madrid",
  "education": "Ingeniería Informática - Universidad Complutense de Madrid (2015-2019)",
  "experience": "Software Developer en Tech Corp (2019-2023). Desarrollé aplicaciones web con React y Node.js."
}
```

Response (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "clx1234567890abcdef",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@ejemplo.com",
    "phone": "+34612345678",
    "address": "Calle Principal 123, Madrid",
    "education": "Ingeniería Informática - Universidad Complutense de Madrid (2015-2019)",
    "experience": "Software Developer en Tech Corp (2019-2023).",
    "cvUrl": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Candidato creado exitosamente"
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación en los datos enviados",
    "details": [
      {
        "field": "email",
        "message": "El email debe tener un formato válido"
      },
      {
        "field": "phone",
        "message": "El teléfono debe seguir el formato E.164"
      }
    ]
  }
}
```

### 2. Estructura de Carpetas

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts           # Configuración de Prisma
│   │   ├── storage.ts            # Configuración de storage (AWS S3, local)
│   │   └── environment.ts        # Variables de entorno
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── fileUpload.middleware.ts
│   ├── modules/
│   │   └── candidates/
│   │       ├── candidate.controller.ts
│   │       ├── candidate.service.ts
│   │       ├── candidate.repository.ts
│   │       ├── candidate.dto.ts
│   │       ├── candidate.routes.ts
│   │       └── __tests__/
│   │           ├── candidate.controller.test.ts
│   │           ├── candidate.service.test.ts
│   │           └── candidate.integration.test.ts
│   ├── types/
│   │   ├── express.d.ts          # Extensión de tipos de Express
│   │   └── common.types.ts
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── fileHandler.ts
│   │   ├── logger.ts
│   │   └── apiResponse.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── app.ts                     # Configuración de Express
│   └── index.ts                   # Entry point
├── uploads/                       # Storage local de archivos
├── .env.example
├── .env
├── package.json
├── tsconfig.json
└── jest.config.js
```

### 3. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      UserRole @default(RECRUITER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  candidates Candidate[]

  @@map("users")
}

enum UserRole {
  ADMIN
  RECRUITER
  MANAGER
}

model Candidate {
  id         String   @id @default(cuid())
  firstName  String   @db.VarChar(50)
  lastName   String   @db.VarChar(50)
  email      String   @unique @db.VarChar(255)
  phone      String   @db.VarChar(20)
  address    String   @db.VarChar(200)
  education  String   @db.Text
  experience String   @db.Text
  cvUrl      String?  @db.VarChar(500)
  cvFileName String?  @db.VarChar(255)
  cvMimeType String?  @db.VarChar(100)
  cvSize     Int?     // En bytes
  status     CandidateStatus @default(NEW)

  createdBy  String
  creator    User     @relation(fields: [createdBy], references: [id], onDelete: Cascade)

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  deletedAt  DateTime? // Soft delete

  @@index([email])
  @@index([createdBy])
  @@index([status])
  @@map("candidates")
}

enum CandidateStatus {
  NEW
  IN_REVIEW
  INTERVIEW_SCHEDULED
  INTERVIEWED
  OFFER_EXTENDED
  HIRED
  REJECTED
  WITHDRAWN
}
```

### 4. DTOs y Validación

#### 4.1 Candidate DTOs

```typescript
// modules/candidates/candidate.dto.ts

import { z } from 'zod';

// Email validation según RFC 5322
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Teléfono internacional E.164
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// DTO para crear candidato
export const createCandidateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, 'El nombre contiene caracteres inválidos'),

  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, 'El apellido contiene caracteres inválidos'),

  email: z
    .string()
    .email('El email debe tener un formato válido')
    .regex(emailRegex, 'Formato de email inválido')
    .toLowerCase()
    .max(255),

  phone: z
    .string()
    .regex(phoneRegex, 'El teléfono debe seguir el formato internacional E.164 (ejemplo: +34612345678)')
    .min(8)
    .max(20),

  address: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),

  education: z
    .string()
    .min(10, 'La educación debe tener al menos 10 caracteres')
    .max(1000, 'La educación no puede exceder 1000 caracteres'),

  experience: z
    .string()
    .min(10, 'La experiencia debe tener al menos 10 caracteres')
    .max(2000, 'La experiencia no puede exceder 2000 caracteres'),
});

// DTO para actualizar candidato (todos los campos opcionales)
export const updateCandidateSchema = createCandidateSchema.partial();

// DTO para query params (listado paginado)
export const listCandidatesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(['createdAt', 'firstName', 'lastName', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  status: z.nativeEnum(CandidateStatus).optional(),
});

// Types inferidos de los schemas
export type CreateCandidateDto = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateDto = z.infer<typeof updateCandidateSchema>;
export type ListCandidatesQuery = z.infer<typeof listCandidatesQuerySchema>;

// Response DTOs
export interface CandidateResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvUrl: string | null;
  cvFileName: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedCandidatesResponseDto {
  data: CandidateResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

### 5. Repository Layer (Data Access)

```typescript
// modules/candidates/candidate.repository.ts

import { PrismaClient, Candidate, Prisma } from '@prisma/client';
import { CreateCandidateDto, UpdateCandidateDto, ListCandidatesQuery } from './candidate.dto';

export class CandidateRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateCandidateDto, userId: string): Promise<Candidate> {
    return this.prisma.candidate.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });
  }

  async findById(id: string): Promise<Candidate | null> {
    return this.prisma.candidate.findUnique({
      where: { id, deletedAt: null },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    return this.prisma.candidate.findUnique({
      where: { email, deletedAt: null },
    });
  }

  async findAll(query: ListCandidatesQuery, userId: string) {
    const { page, limit, sortBy, sortOrder, search, status } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.CandidateWhereInput = {
      deletedAt: null,
      createdBy: userId, // Solo ver candidatos propios
      ...(status && { status }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Execute queries in parallel
    const [candidates, total] = await Promise.all([
      this.prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.candidate.count({ where }),
    ]);

    return {
      candidates,
      total,
      page,
      limit,
    };
  }

  async update(id: string, data: UpdateCandidateDto, userId: string): Promise<Candidate | null> {
    // Verificar que el candidato existe y pertenece al usuario
    const candidate = await this.findById(id);
    if (!candidate || candidate.createdBy !== userId) {
      return null;
    }

    return this.prisma.candidate.update({
      where: { id },
      data,
    });
  }

  async updateCvInfo(
    id: string,
    cvInfo: { cvUrl: string; cvFileName: string; cvMimeType: string; cvSize: number }
  ): Promise<Candidate> {
    return this.prisma.candidate.update({
      where: { id },
      data: cvInfo,
    });
  }

  async softDelete(id: string, userId: string): Promise<boolean> {
    const candidate = await this.findById(id);
    if (!candidate || candidate.createdBy !== userId) {
      return false;
    }

    await this.prisma.candidate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return true;
  }
}
```

### 6. Service Layer (Business Logic)

```typescript
// modules/candidates/candidate.service.ts

import { CandidateRepository } from './candidate.repository';
import { CreateCandidateDto, UpdateCandidateDto, ListCandidatesQuery } from './candidate.dto';
import { ConflictError, NotFoundError, ForbiddenError } from '../../utils/errors';
import { FileHandler } from '../../utils/fileHandler';
import { Logger } from '../../utils/logger';

export class CandidateService {
  constructor(
    private repository: CandidateRepository,
    private fileHandler: FileHandler,
    private logger: Logger
  ) {}

  async createCandidate(data: CreateCandidateDto, userId: string) {
    // Verificar si ya existe un candidato con ese email
    const existingCandidate = await this.repository.findByEmail(data.email);
    if (existingCandidate) {
      throw new ConflictError('Ya existe un candidato con este email');
    }

    try {
      const candidate = await this.repository.create(data, userId);
      this.logger.info(`Candidato creado: ${candidate.id}`, { userId, candidateId: candidate.id });
      return candidate;
    } catch (error) {
      this.logger.error('Error al crear candidato', { error, userId });
      throw error;
    }
  }

  async getCandidateById(id: string, userId: string) {
    const candidate = await this.repository.findById(id);

    if (!candidate) {
      throw new NotFoundError('Candidato no encontrado');
    }

    if (candidate.createdBy !== userId) {
      throw new ForbiddenError('No tienes permisos para ver este candidato');
    }

    return candidate;
  }

  async listCandidates(query: ListCandidatesQuery, userId: string) {
    const result = await this.repository.findAll(query, userId);

    const totalPages = Math.ceil(result.total / result.limit);

    return {
      data: result.candidates,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages,
        hasNextPage: result.page < totalPages,
        hasPrevPage: result.page > 1,
      },
    };
  }

  async updateCandidate(id: string, data: UpdateCandidateDto, userId: string) {
    // Si se actualiza el email, verificar que no exista otro candidato con ese email
    if (data.email) {
      const existingCandidate = await this.repository.findByEmail(data.email);
      if (existingCandidate && existingCandidate.id !== id) {
        throw new ConflictError('Ya existe un candidato con este email');
      }
    }

    const candidate = await this.repository.update(id, data, userId);

    if (!candidate) {
      throw new NotFoundError('Candidato no encontrado o sin permisos');
    }

    this.logger.info(`Candidato actualizado: ${id}`, { userId, candidateId: id });
    return candidate;
  }

  async uploadCv(id: string, file: Express.Multer.File, userId: string) {
    const candidate = await this.getCandidateById(id, userId);

    // Si ya tiene CV, eliminarlo
    if (candidate.cvUrl) {
      await this.fileHandler.deleteFile(candidate.cvUrl);
    }

    // Guardar nuevo archivo
    const fileUrl = await this.fileHandler.saveFile(file, 'cvs');

    // Actualizar información en BD
    const updated = await this.repository.updateCvInfo(id, {
      cvUrl: fileUrl,
      cvFileName: file.originalname,
      cvMimeType: file.mimetype,
      cvSize: file.size,
    });

    this.logger.info(`CV subido para candidato: ${id}`, { userId, candidateId: id });
    return updated;
  }

  async deleteCandidate(id: string, userId: string) {
    const deleted = await this.repository.softDelete(id, userId);

    if (!deleted) {
      throw new NotFoundError('Candidato no encontrado o sin permisos');
    }

    this.logger.info(`Candidato eliminado: ${id}`, { userId, candidateId: id });
  }
}
```

### 7. Controller Layer

```typescript
// modules/candidates/candidate.controller.ts

import { Request, Response, NextFunction } from 'express';
import { CandidateService } from './candidate.service';
import {
  createCandidateSchema,
  updateCandidateSchema,
  listCandidatesQuerySchema
} from './candidate.dto';
import { ApiResponse } from '../../utils/apiResponse';

export class CandidateController {
  constructor(private service: CandidateService) {}

  createCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validación ya realizada por middleware
      const data = req.body;
      const userId = req.user!.id; // Asumiendo que el middleware de auth inyecta el user

      const candidate = await this.service.createCandidate(data, userId);

      return res
        .status(201)
        .json(ApiResponse.success(candidate, 'Candidato creado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  getCandidateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const candidate = await this.service.getCandidateById(id, userId);

      return res.json(ApiResponse.success(candidate));
    } catch (error) {
      next(error);
    }
  };

  listCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = listCandidatesQuerySchema.parse(req.query);
      const userId = req.user!.id;

      const result = await this.service.listCandidates(query, userId);

      return res.json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  };

  updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user!.id;

      const candidate = await this.service.updateCandidate(id, data, userId);

      return res.json(ApiResponse.success(candidate, 'Candidato actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  uploadCv = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json(ApiResponse.error('MISSING_FILE', 'No se proporcionó ningún archivo'));
      }

      const candidate = await this.service.uploadCv(id, file, userId);

      return res.json(ApiResponse.success(candidate, 'CV subido exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  deleteCandidate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await this.service.deleteCandidate(id, userId);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
```

### 8. Middleware: Validation

```typescript
// middlewares/validation.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiResponse } from '../utils/apiResponse';

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar el body de la request
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json(
          ApiResponse.error('VALIDATION_ERROR', 'Error de validación en los datos enviados', errors)
        );
      }
      next(error);
    }
  };
};
```

### 9. Middleware: File Upload

```typescript
// middlewares/fileUpload.middleware.ts

import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { BadRequestError } from '../utils/errors';

// Configuración de storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `cv-${uniqueSuffix}${ext}`);
  },
});

// Filtro de tipos de archivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Solo se permiten archivos PDF o DOCX'));
  }
};

export const uploadCV = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
```

### 10. Routes

```typescript
// modules/candidates/candidate.routes.ts

import { Router } from 'express';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { CandidateRepository } from './candidate.repository';
import { validate } from '../../middlewares/validation.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { uploadCV } from '../../middlewares/fileUpload.middleware';
import { createCandidateSchema, updateCandidateSchema } from './candidate.dto';
import { prisma } from '../../config/database';
import { fileHandler } from '../../utils/fileHandler';
import { logger } from '../../utils/logger';

// Dependency Injection
const repository = new CandidateRepository(prisma);
const service = new CandidateService(repository, fileHandler, logger);
const controller = new CandidateController(service);

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// CRUD Endpoints
router.post(
  '/',
  validate(createCandidateSchema),
  controller.createCandidate
);

router.get('/', controller.listCandidates);

router.get('/:id', controller.getCandidateById);

router.put(
  '/:id',
  validate(updateCandidateSchema),
  controller.updateCandidate
);

router.delete('/:id', controller.deleteCandidate);

// File Upload Endpoints
router.post(
  '/:id/cv',
  uploadCV.single('cv'),
  controller.uploadCv
);

export default router;
```

### 11. Error Handling

```typescript
// utils/errors.ts

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autenticado') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'No tienes permisos') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(404, message, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Error interno del servidor') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
  }
}
```

```typescript
// middlewares/errorHandler.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log del error
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  });

  // Errores controlados (AppError)
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(
      ApiResponse.error(error.code, error.message, error.details)
    );
  }

  // Errores de Prisma
  if (error.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json(
      ApiResponse.error('DATABASE_ERROR', 'Error en la base de datos')
    );
  }

  // Errores no controlados
  return res.status(500).json(
    ApiResponse.error('INTERNAL_SERVER_ERROR', 'Error interno del servidor')
  );
};
```

### 12. Testing

#### 12.1 Unit Test: Service

```typescript
// modules/candidates/__tests__/candidate.service.test.ts

import { CandidateService } from '../candidate.service';
import { CandidateRepository } from '../candidate.repository';
import { ConflictError, NotFoundError } from '../../../utils/errors';

// Mocks
const mockRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
} as any;

const mockFileHandler = {
  saveFile: jest.fn(),
  deleteFile: jest.fn(),
} as any;

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
} as any;

describe('CandidateService', () => {
  let service: CandidateService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CandidateService(mockRepository, mockFileHandler, mockLogger);
  });

  describe('createCandidate', () => {
    const mockData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@ejemplo.com',
      phone: '+34612345678',
      address: 'Calle Principal 123',
      education: 'Ingeniería Informática',
      experience: '5 años como desarrollador',
    };

    it('should create a candidate successfully', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({ id: '123', ...mockData });

      const result = await service.createCandidate(mockData, 'user-123');

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(mockData.email);
      expect(mockRepository.create).toHaveBeenCalledWith(mockData, 'user-123');
      expect(result).toHaveProperty('id', '123');
    });

    it('should throw ConflictError if email already exists', async () => {
      mockRepository.findByEmail.mockResolvedValue({ id: 'existing', email: mockData.email });

      await expect(service.createCandidate(mockData, 'user-123')).rejects.toThrow(ConflictError);
    });
  });

  describe('getCandidateById', () => {
    it('should return candidate if found and user has access', async () => {
      const mockCandidate = { id: '123', createdBy: 'user-123', firstName: 'Juan' };
      mockRepository.findById.mockResolvedValue(mockCandidate);

      const result = await service.getCandidateById('123', 'user-123');

      expect(result).toEqual(mockCandidate);
    });

    it('should throw NotFoundError if candidate does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.getCandidateById('999', 'user-123')).rejects.toThrow(NotFoundError);
    });
  });
});
```

#### 12.2 Integration Test

```typescript
// modules/candidates/__tests__/candidate.integration.test.ts

import request from 'supertest';
import app from '../../../app';
import { prisma } from '../../../config/database';

describe('Candidates API Integration Tests', () => {
  let authToken: string;
  let candidateId: string;

  beforeAll(async () => {
    // Obtener token de autenticación (mock o real)
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@ejemplo.com', password: 'password123' });

    authToken = loginRes.body.data.token;
  });

  afterAll(async () => {
    // Limpiar base de datos de pruebas
    await prisma.candidate.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/candidates', () => {
    it('should create a new candidate', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.test@ejemplo.com',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        education: 'Ingeniería Informática',
        experience: '5 años como desarrollador',
      };

      const response = await request(app)
        .post('/api/v1/candidates')
        .set('Authorization', `Bearer ${authToken}`)
        .send(candidateData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(candidateData.email);

      candidateId = response.body.data.id;
    });

    it('should return 400 for invalid email', async () => {
      const invalidData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'invalid-email',
        phone: '+34612345678',
        address: 'Calle Principal 123',
        education: 'Ingeniería Informática',
        experience: '5 años como desarrollador',
      };

      const response = await request(app)
        .post('/api/v1/candidates')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/v1/candidates')
        .send({})
        .expect(401);
    });
  });

  describe('GET /api/v1/candidates/:id', () => {
    it('should get candidate by id', async () => {
      const response = await request(app)
        .get(`/api/v1/candidates/${candidateId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(candidateId);
    });

    it('should return 404 for non-existent candidate', async () => {
      await request(app)
        .get('/api/v1/candidates/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
```

## ✅ Criterios Técnicos Obligatorios

**Technical Criteria:**

- **SOLID Principles:**
  - **Single Responsibility:** Separación clara entre Controller, Service y Repository
  - **Open/Closed:** Servicios extendibles mediante interfaces
  - **Liskov Substitution:** Repositories intercambiables
  - **Interface Segregation:** DTOs específicos por operación
  - **Dependency Inversion:** Inyección de dependencias

- **Clean Code:**
  - Nombres descriptivos y semánticos
  - Funciones pequeñas y con un solo propósito
  - Comentarios solo cuando sea necesario
  - DRY (Don't Repeat Yourself)

- **Security:**
  - Validación de entrada estricta
  - Autenticación JWT
  - Rate limiting
  - Sanitización de datos
  - HTTPS obligatorio en producción

**General Criteria:**

- Attractive title ✅
- Arquitectura en capas
- Error handling robusto
- Logging comprehensivo

## 🚀 Acción Requerida

Genera el código completo del backend siguiendo:

1. **Arquitectura en capas:** Repository → Service → Controller
2. **Type safety:** Todo tipado con TypeScript
3. **Validación robusta:** Zod schemas + middleware
4. **Testing completo:** Unit + Integration (coverage >80%)
5. **Documentación:** JSDoc + OpenAPI/Swagger

**Prioriza:** Seguridad, escalabilidad y mantenibilidad.

**Entrega:** API production-ready con tests y documentación.
