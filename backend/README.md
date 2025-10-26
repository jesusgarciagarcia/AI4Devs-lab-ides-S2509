# 🚀 Backend Imparable - API REST para ATS

**Título:** "¡Backend Imparable! 🚀 - El API que Nunca Duerme (Pero Sí Valida)"

Backend robusto y escalable para el sistema ATS (Applicant Tracking System), construido con Node.js, TypeScript, Express siguiendo **Arquitectura Hexagonal** y **Vertical Slice Architecture**.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecutar el Proyecto](#-ejecutar-el-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Arquitectura](#-arquitectura)
- [Seguridad](#-seguridad)

## ✨ Características

- ✅ **Arquitectura Hexagonal**: Domain → Application → Infrastructure
- ✅ **Vertical Slice Architecture**: Organización por features
- ✅ **In-Memory Repository**: Desarrollo sin Docker (por defecto)
- ✅ **Type Safety**: 100% TypeScript
- ✅ **Validación Robusta**: Value Objects + Zod schemas
- ✅ **Autenticación**: JWT-based authentication
- ✅ **Rate Limiting**: Protección contra abuso
- ✅ **File Upload**: Manejo de CVs (PDF/DOCX, max 5MB)
- ✅ **Error Handling**: Manejo centralizado de errores
- ✅ **Logging**: Winston logger con rotación de archivos
- ✅ **Testing**: Unit tests + Integration tests (Jest)
- ✅ **Soft Delete**: Eliminación lógica de candidatos
- ✅ **Pagination**: Listado paginado con filtros
- ✅ **SOLID Principles**: Código mantenible y escalable
- ✅ **Dependency Injection**: DI Container para flexibilidad

## 🛠 Tecnologías

- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5.0+
- **Framework**: Express 4.x
- **ORM**: Prisma 5.x (opcional)
- **Base de Datos**: PostgreSQL (opcional) / In-Memory (por defecto)
- **Validación**: Zod + Value Objects
- **Autenticación**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Linting**: ESLint + Prettier

## 📦 Requisitos Previos

### Modo In-Memory (Recomendado para desarrollo)

- Node.js >= 18.0.0
- npm >= 9.0.0

### Modo Prisma (Producción)

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0
- Docker (opcional, para correr PostgreSQL)

## 🚀 Instalación

### Opción 1: Modo In-Memory (Sin Docker) ⚡

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Asegúrate que USE_IN_MEMORY_DB=true en .env
# Ya está configurado por defecto

# 4. Ejecutar
npm run dev
```

### Opción 2: Modo Prisma (Con PostgreSQL) 🗄️

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env: USE_IN_MEMORY_DB=false y configurar DATABASE_URL

# 3. Levantar PostgreSQL con Docker (opcional)
docker-compose up -d

# 4. Generar Prisma Client
npx prisma generate

# 5. Ejecutar migraciones de base de datos
npx prisma migrate dev --name init

# 6. (Opcional) Seed inicial
npx prisma db seed

# 7. Ejecutar
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno Clave

```env
# ==================== REPOSITORY CONFIGURATION ====================
# Set to 'true' para desarrollo rápido sin Docker (in-memory)
# Set to 'false' para usar PostgreSQL con Prisma
USE_IN_MEMORY_DB=true

# ==================== DATABASE (solo si USE_IN_MEMORY_DB=false) ====================
DATABASE_URL="postgresql://user:password@localhost:5432/ats_db"

# ==================== APPLICATION ====================
NODE_ENV=development
PORT=3010

# ==================== JWT ====================
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN=24h
```

Ver `.env.example` para todas las opciones disponibles.

## 🏃 Ejecutar el Proyecto

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm run build
npm start

# Tests
npm test

# Tests con coverage
npm run test:coverage
```

El servidor estará disponible en: `http://localhost:3010`

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/              # Configuración (DB, environment, storage)
│   ├── middlewares/         # Middlewares (auth, validation, error handling)
│   ├── modules/
│   │   └── candidates/      # Módulo de candidatos
│   │       ├── candidate.controller.ts
│   │       ├── candidate.service.ts
│   │       ├── candidate.repository.ts
│   │       ├── candidate.dto.ts
│   │       ├── candidate.routes.ts
│   │       └── __tests__/   # Tests unitarios e integración
│   ├── types/               # Tipos y definiciones TypeScript
│   ├── utils/               # Utilidades (errors, logger, validators)
│   ├── app.ts               # Configuración de Express
│   └── index.ts             # Entry point
├── prisma/
│   └── schema.prisma        # Schema de Prisma
├── uploads/                 # Archivos subidos
├── logs/                    # Logs de la aplicación
├── .env.example
├── tsconfig.json
├── jest.config.js
└── package.json
```

## 🔌 API Endpoints

### Candidatos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/candidates` | Crear candidato | ✓ |
| GET | `/api/v1/candidates` | Listar candidatos (paginado) | ✓ |
| GET | `/api/v1/candidates/:id` | Obtener candidato | ✓ |
| PUT | `/api/v1/candidates/:id` | Actualizar candidato | ✓ |
| DELETE | `/api/v1/candidates/:id` | Eliminar candidato | ✓ |
| POST | `/api/v1/candidates/:id/cv` | Subir CV | ✓ |
| GET | `/api/v1/candidates/:id/cv` | Descargar CV | ✓ |
| DELETE | `/api/v1/candidates/:id/cv` | Eliminar CV | ✓ |
| GET | `/api/v1/candidates/stats` | Estadísticas | ✓ |

### Utilidad

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Info del API |

### Ejemplo de Request

**POST /api/v1/candidates**

```bash
curl -X POST http://localhost:3010/api/v1/candidates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@ejemplo.com",
    "phone": "+34612345678",
    "address": "Calle Principal 123, Madrid",
    "education": "Ingeniería Informática",
    "experience": "5 años como desarrollador"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@ejemplo.com",
    "cvUrl": null,
    "status": "NEW",
    "createdAt": "2025-10-26T10:30:00.000Z"
  },
  "message": "Candidato creado exitosamente"
}
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch

# Solo tests unitarios
npm run test:unit

# Solo tests de integración
npm run test:integration
```

Los tests incluyen:

- ✅ Unit tests del Service layer
- ✅ Integration tests de los endpoints
- ✅ Cobertura > 80%

## 🏗 Arquitectura

### Patrón de Capas

```
Controller (HTTP) → Service (Business Logic) → Repository (Data Access) → Database
```

**Principios SOLID:**

- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Extendible sin modificar código existente
- **L**iskov Substitution: Interfaces intercambiables
- **I**nterface Segregation: DTOs específicos por operación
- **D**ependency Inversion: Inyección de dependencias

### Flujo de una Request

```
1. Request → Express
2. Middleware de autenticación (JWT)
3. Middleware de validación (Zod)
4. Controller (maneja HTTP)
5. Service (lógica de negocio)
6. Repository (acceso a datos)
7. Database (Prisma → PostgreSQL)
8. Response ← Express
9. Middleware de error handling
```

## 🔒 Seguridad

- ✅ **JWT Authentication**: Tokens con expiración
- ✅ **Rate Limiting**: 100 requests/15min por IP
- ✅ **Input Validation**: Zod schemas estrictos
- ✅ **CORS**: Configurado por origen
- ✅ **Helmet**: Headers de seguridad (recomendado)
- ✅ **File Validation**: Solo PDF/DOCX, max 5MB
- ✅ **SQL Injection**: Prevenido por Prisma ORM
- ✅ **XSS Protection**: Sanitización de inputs
- ✅ **HTTPS**: Obligatorio en producción

## 📝 Variables de Entorno

Ver `.env.example` para la lista completa. Las principales:

- `DATABASE_URL`: Connection string de PostgreSQL
- `JWT_SECRET`: Secret para firmar JWT tokens
- `PORT`: Puerto del servidor (default: 3010)
- `NODE_ENV`: development | production | test

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es parte del sistema ATS y sigue las políticas internas de la organización.

## 👥 Equipo

Desarrollado por el equipo de Backend ATS Team.

---

**¡Backend Imparable! 🚀 - Porque un buen backend es como un buen café: fuerte, confiable y siempre disponible!** ☕💪
