# Candidates Module - Hexagonal Architecture

## 📐 Arquitectura

Este módulo está implementado siguiendo los principios de **Arquitectura Hexagonal** (también conocida como Ports & Adapters) y **Vertical Slice Architecture**.

### Estructura de Capas

```
src/candidates/
├── domain/                    # ⬡ CORE - Lógica de negocio pura
│   ├── entities/
│   │   └── Candidate.ts       # Entidad de dominio con lógica de negocio
│   ├── repositories/
│   │   └── ICandidateRepository.ts  # Puerto de salida (interfaz)
│   └── value-objects/
│       ├── Email.ts           # Value Object para validación de email
│       └── Phone.ts           # Value Object para validación de teléfono
│
├── application/               # 📋 Casos de uso
│   └── use-cases/
│       ├── CreateCandidateUseCase.ts
│       ├── GetCandidateUseCase.ts
│       ├── ListCandidatesUseCase.ts
│       ├── UpdateCandidateUseCase.ts
│       ├── DeleteCandidateUseCase.ts
│       ├── UploadCVUseCase.ts
│       └── DeleteCVUseCase.ts
│
├── infrastructure/            # 🔌 Adaptadores externos
│   ├── persistence/
│   │   ├── InMemoryCandidateRepository.ts  # Adaptador in-memory
│   │   └── PrismaCandidateRepository.ts    # Adaptador Prisma
│   ├── http/
│   │   ├── CandidateController.ts          # Controlador HTTP
│   │   └── candidateRoutes.ts              # Definición de rutas
│   └── di/
│       └── container.ts                    # Contenedor de DI
│
└── index.ts                   # Punto de entrada del módulo
```

### Principios Aplicados

#### 1. **Dependency Inversion (SOLID)**

- El dominio y la aplicación NO dependen de la infraestructura
- Las dependencias apuntan hacia el interior (domain ← application ← infrastructure)
- Se usan interfaces (puertos) para la comunicación

#### 2. **Separation of Concerns**

- **Domain**: Lógica de negocio pura, sin dependencias externas
- **Application**: Orquestación de casos de uso
- **Infrastructure**: Adaptadores para servicios externos (DB, HTTP, etc.)

#### 3. **Single Responsibility (SOLID)**

- Cada use case tiene una única responsabilidad
- Las entidades encapsulan su propia lógica de negocio

## 🔄 Flujo de Datos

```
HTTP Request
    ↓
[Controller] ← Infrastructure Layer
    ↓
[Use Case] ← Application Layer
    ↓
[Entity] ← Domain Layer
    ↓
[Repository Interface] ← Domain Layer (Port)
    ↓
[Repository Implementation] ← Infrastructure Layer (Adapter)
    ↓
Database / Memory
```

## 🗄️ Repositorios: In-Memory vs Prisma

El módulo soporta **dos implementaciones** del repositorio:

### In-Memory Repository (Por Defecto)

✅ **Ventajas:**

- No requiere Docker ni PostgreSQL
- Perfecto para desarrollo rápido
- Ideal para testing
- Sin configuración adicional

❌ **Desventajas:**

- Los datos se pierden al reiniciar
- No persistente

### Prisma Repository

✅ **Ventajas:**

- Persistencia real en PostgreSQL
- Datos persistentes
- Producción-ready

❌ **Desventajas:**

- Requiere Docker y PostgreSQL
- Más configuración

### Cambiar entre Repositorios

Edita el archivo `.env`:

```bash
# Para usar In-Memory (por defecto)
USE_IN_MEMORY_DB=true

# Para usar Prisma + PostgreSQL
USE_IN_MEMORY_DB=false
```

## 🚀 Uso

### Inicialización

El módulo se inicializa automáticamente en `src/app.ts`:

```typescript
import { initCandidatesModule } from './candidates';

const candidateRoutes = initCandidatesModule();
app.use('/api/v1/candidates', candidateRoutes);
```

### Crear un Nuevo Use Case

1. Define la interfaz del use case en `application/use-cases/`:

```typescript
export interface MyUseCaseRequest {
  // ...
}

export interface MyUseCaseResponse {
  // ...
}

export class MyUseCase {
  constructor(private readonly repository: ICandidateRepository) {}

  async execute(request: MyUseCaseRequest): Promise<MyUseCaseResponse> {
    // Lógica del caso de uso
  }
}
```

2. Registra el use case en el contenedor DI (`infrastructure/di/container.ts`)

3. Inyecta el use case en el controlador

## 🧪 Testing

### Unit Tests (Use Cases)

Los use cases se pueden testear fácilmente con mocks:

```typescript
const mockRepository: ICandidateRepository = {
  save: jest.fn(),
  findById: jest.fn(),
  // ...
};

const useCase = new CreateCandidateUseCase(mockRepository);
```

### Integration Tests

Usa el `InMemoryCandidateRepository` para tests de integración:

```typescript
const repository = new InMemoryCandidateRepository();
const useCase = new CreateCandidateUseCase(repository);
```

## 📝 Endpoints API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/candidates` | Crear candidato |
| GET | `/api/v1/candidates` | Listar candidatos (paginado) |
| GET | `/api/v1/candidates/:id` | Obtener candidato por ID |
| PUT | `/api/v1/candidates/:id` | Actualizar candidato |
| DELETE | `/api/v1/candidates/:id` | Eliminar candidato (soft delete) |
| POST | `/api/v1/candidates/:id/cv` | Subir CV |
| DELETE | `/api/v1/candidates/:id/cv` | Eliminar CV |

## 🎯 Beneficios de Esta Arquitectura

1. **Testabilidad**: Lógica de negocio aislada y fácil de testear
2. **Flexibilidad**: Fácil cambiar implementaciones (in-memory ↔ Prisma)
3. **Mantenibilidad**: Código organizado y con responsabilidades claras
4. **Escalabilidad**: Fácil agregar nuevos use cases o adaptadores
5. **Independence**: El dominio no depende de frameworks o bases de datos

## 🔧 Configuración Avanzada

### Agregar un Nuevo Adaptador

Para agregar un nuevo adaptador de repositorio (ej: MongoDB):

1. Crea `infrastructure/persistence/MongoCandidateRepository.ts`
2. Implementa la interfaz `ICandidateRepository`
3. Actualiza el contenedor DI para incluir la nueva opción

```typescript
const dbType = process.env.DB_TYPE; // 'memory' | 'prisma' | 'mongo'

switch(dbType) {
  case 'memory':
    this.repository = new InMemoryCandidateRepository();
    break;
  case 'prisma':
    this.repository = new PrismaCandidateRepository(prisma);
    break;
  case 'mongo':
    this.repository = new MongoCandidateRepository(mongoClient);
    break;
}
```

## 📚 Referencias

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
