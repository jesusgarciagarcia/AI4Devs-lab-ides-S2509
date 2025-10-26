# Copilot Instructions for AI4Devs-lab-ides-S2509

## Project Overview

- **Full-stack ATS (Applicant Tracking System)** with a React frontend and a TypeScript/Express backend.
- **Backend** follows Hexagonal Architecture and Vertical Slice Architecture, emphasizing separation of concerns and feature-based organization.
- **Frontend** is a standard Create React App project.

## Key Architectural Patterns

- **Hexagonal Architecture (Ports & Adapters):**
  - `domain/`: Pure business logic (entities, value objects, interfaces)
  - `application/`: Use cases (orchestrate business logic)
  - `infrastructure/`: Adapters for DB, HTTP, etc.
  - **Dependency flow:** infrastructure → application → domain (never the reverse)
- **Vertical Slice:**
  - Features are grouped by domain (e.g., `candidates/`), each with its own domain, application, and infrastructure layers.

## Backend Developer Workflows

- **Install dependencies:**
  - `cd backend && npm install`
- **Run in development:**
  - `npm run dev` (uses in-memory repo by default)
- **Build for production:**
  - `npm run build`
- **Run tests:**
  - `npm test` (unit & integration via Jest)
- **Prisma ORM:**
  - Schema: `backend/prisma/schema.prisma`
  - Migrations: `npx prisma migrate dev`
  - Switch between in-memory and DB by changing config/env
- **Logging:**
  - Centralized via Winston (`src/utils/logger.ts`)
- **Error handling:**
  - Centralized middleware (`src/middlewares/errorHandler.middleware.ts`)
- **Validation:**
  - Zod schemas and value objects in domain layer

## Frontend Developer Workflows

- **Install dependencies:**
  - `cd frontend && npm install`
- **Run in development:**
  - `npm start`
- **Run tests:**
  - `npm test` (Jest)
- **E2E tests:**
  - Playwright specs in `frontend/e2e/`

## Project Conventions

- **Feature-first structure:**
  - Example: `backend/src/candidates/` contains all logic for candidates (domain, use-cases, adapters, DI)
- **Type safety:**
  - 100% TypeScript, including types for Express
- **Testing:**
  - Unit: `backend/src/candidates/__tests__/`
  - Integration: `backend/tests/integration/`
- **File uploads:**
  - CVs stored in `uploads/cvs/` (max 5MB, PDF/DOCX)
- **Authentication:**
  - JWT-based, see `src/middlewares/auth.middleware.ts`
- **Rate limiting:**
  - See `src/middlewares/rateLimiter.middleware.ts`

## Examples

- To add a new feature, create a new folder under `backend/src/` with `domain/`, `application/`, and `infrastructure/` subfolders.
- To add a new use case for candidates, add a file to `backend/src/candidates/application/use-cases/`.

## References

- See `backend/README.md` and `backend/src/candidates/README.md` for detailed architecture and workflow explanations.
- For frontend, see `frontend/README.md`.

---

If any section is unclear or missing, please provide feedback for improvement.
