# 🧪 Guía de Tests - ATS Project

Esta guía explica la estructura de tests del proyecto y cómo ejecutarlos.

## 📁 Estructura de Tests

El proyecto sigue una arquitectura organizada donde los tests están separados de la implementación:

```
AI4Devs-lab-ides-S2509/
├── backend/
│   ├── src/                          # Código fuente
│   │   ├── candidates/               # Feature: Candidates
│   │   ├── config/
│   │   ├── middlewares/
│   │   └── utils/
│   └── tests/                        # ⭐ Tests backend (estructura espejo de src/)
│       ├── setup.ts                  # Configuración global
│       ├── unit/                     # Tests unitarios
│       │   └── candidates/
│       │       ├── application/      # Tests de casos de uso
│       │       └── domain/           # Tests de entidades y value objects
│       │           ├── Candidate.entity.test.ts
│       │           └── value-objects/
│       │               ├── Email.test.ts
│       │               └── Phone.test.ts
│       └── integration/              # Tests de integración
│           ├── api/
│           │   └── health.integration.test.ts
│           └── candidates/
│               └── infrastructure/   # Tests de repositorios y adapters
│
├── frontend/
│   ├── src/                          # Código fuente
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── tests/                        # ⭐ Tests frontend (estructura espejo de src/)
│       ├── setupTests.ts             # Configuración global
│       ├── unit/                     # Tests unitarios
│       │   ├── App.test.tsx
│       │   └── components/
│       │       ├── atoms/
│       │       │   ├── Button/
│       │       │   │   └── Button.test.tsx
│       │       │   └── TextField/
│       │       │       └── TextField.test.tsx
│       │       └── organisms/
│       │           └── AddCandidateForm/
│       │               └── AddCandidateForm.test.tsx
│       └── integration/              # Tests de integración
│
└── tests/                            # ⭐ Tests E2E (Playwright)
    ├── playwright.config.ts
    ├── e2e/
    │   └── candidates/
    │       └── add-candidate.e2e.test.ts
    └── helpers/

```

## 🎯 Tipos de Tests

### 1️⃣ Tests Unitarios (Unit Tests)

**Propósito:** Testear componentes individuales de forma aislada, sin dependencias externas.

**Backend:**

- Entidades del dominio
- Value Objects
- Casos de uso (con mocks)
- Utilidades

**Frontend:**

- Componentes React
- Hooks personalizados
- Utilidades
- Schemas de validación

**Características:**

- ⚡ Rápidos (sin DB, sin API, sin I/O)
- 🔒 Aislados (usan mocks)
- 📊 Cobertura de lógica de negocio

### 2️⃣ Tests de Integración (Integration Tests)

**Propósito:** Testear la integración entre diferentes capas y componentes.

**Backend:**

- Repositorios con base de datos real (o in-memory)
- Endpoints HTTP con Express
- Middlewares
- Integraciones con servicios externos

**Frontend:**

- Integración de componentes complejos
- Llamadas a API (con MSW - Mock Service Worker)
- Flujos de estado completos

**Características:**

- 🐌 Más lentos que unit tests
- 🔗 Requieren servicios (DB, APIs)
- 🎯 Verifican integración real

### 3️⃣ Tests E2E (End-to-End)

**Propósito:** Testear flujos completos de usuario de principio a fin.

**Herramienta:** Playwright

**Alcance:**

- Flujo completo: Frontend → Backend → Database
- Interacciones reales del navegador
- Validación de criterios de aceptación

**Características:**

- 🐢 Los más lentos
- 🌐 Requieren todos los servicios activos
- ✅ Validan la aplicación completa

## 🚀 Ejecución de Tests

### Opción 1: Scripts NPM (desde raíz del proyecto)

```bash
# Tests Unitarios
npm run test:unit                    # Todos los unitarios (backend + frontend)
npm run test:unit:backend            # Solo backend
npm run test:unit:frontend           # Solo frontend
npm run test:watch                   # Modo watch (backend)
npm run test:coverage                # Con cobertura

# Tests de Integración
npm run test:integration             # Todos los de integración
npm run test:integration:backend     # Solo backend
npm run test:integration:frontend    # Solo frontend

# Tests E2E
npm run test:e2e                     # Ejecuta tests E2E
npm run test:e2e:ui                  # Modo UI interactivo
npm run test:e2e:headed              # Ver el navegador
npm run test:e2e:report              # Ver reporte HTML

# Todos los tests
npm run test:all                     # Ejecuta unit + integration + e2e
```

### Opción 2: Script de Automatización (RECOMENDADO) 🎉

#### Windows (PowerShell)

```powershell
# Tests unitarios
.\run-tests.ps1 -Type unit

# Tests unitarios en modo watch
.\run-tests.ps1 -Type unit -Watch

# Tests con cobertura
.\run-tests.ps1 -Type unit -Coverage

# Tests de integración
.\run-tests.ps1 -Type integration

# Tests E2E
.\run-tests.ps1 -Type e2e

# TODOS los tests
.\run-tests.ps1 -Type all
```

#### Linux/Mac (Bash)

```bash
# Dar permisos de ejecución (primera vez)
chmod +x run-tests.sh

# Tests unitarios
./run-tests.sh unit

# Tests unitarios en modo watch
./run-tests.sh unit --watch

# Tests con cobertura
./run-tests.sh unit --coverage

# Tests de integración
./run-tests.sh integration

# Tests E2E
./run-tests.sh e2e

# TODOS los tests
./run-tests.sh all
```

## 📋 Pre-requisitos para Tests

### Tests Unitarios

- ✅ No requieren nada adicional
- Funcionan out-of-the-box

### Tests de Integración

- 🐳 Docker Desktop ejecutándose
- 🗄️ PostgreSQL container activo
- Ejecutar antes:

  ```bash
  npm run services:up
  npm run db:prepare
  ```

### Tests E2E

- 🐳 Docker Desktop ejecutándose
- 🗄️ PostgreSQL container activo
- 🖥️ Backend en <http://localhost:3010>
- 🌐 Frontend en <http://localhost:3000>
- 👤 Usuario system creado en DB

El script de automatización y el playwright.config se encargan automáticamente de:

- Levantar servicios Docker
- Ejecutar migraciones
- Crear usuario system
- Iniciar backend y frontend

## 🏗️ Convenciones

### Nomenclatura de Archivos

```
# Backend
*.test.ts            # Tests unitarios
*.integration.test.ts # Tests de integración

# Frontend
*.test.tsx           # Tests de componentes
*.test.ts            # Tests de hooks/utils
*.integration.test.tsx # Tests de integración

# E2E
*.e2e.test.ts        # Tests de Playwright
```

### Estructura de Tests

```typescript
describe('Nombre del Componente/Feature', () => {
  describe('Grupo de tests relacionados', () => {
    it('should comportamiento esperado', () => {
      // Arrange (preparar)
      // Act (actuar)
      // Assert (verificar)
    });
  });
});
```

## 📊 Cobertura de Código

```bash
# Generar reporte de cobertura
npm run test:coverage

# Backend: backend/coverage/unit/lcov-report/index.html
# Frontend: frontend/coverage/unit/lcov-report/index.html
```

## 🐛 Debugging Tests

### Backend (Jest)

```bash
# Ejecutar un test específico
cd backend
npm test -- Candidate.entity.test.ts

# Modo debug
npm test -- --detectOpenHandles
```

### Frontend (Jest)

```bash
cd frontend
npm test -- Button.test.tsx
```

### E2E (Playwright)

```bash
# Ver el navegador durante la ejecución
npm run test:e2e:headed

# Modo UI interactivo (RECOMENDADO para debugging)
npm run test:e2e:ui

# Ver traces después de una falla
npm run test:e2e:report
```

## 📖 Referencias

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

## ✅ Checklist de Calidad

Antes de hacer commit/push, asegúrate de que:

- [ ] Todos los tests unitarios pasan
- [ ] Los tests de integración pasan (con Docker)
- [ ] Los tests E2E pasan
- [ ] La cobertura de código es >= 80%
- [ ] No hay tests deshabilitados sin justificación
- [ ] Nuevas features tienen tests correspondientes

---

**Última actualización:** Octubre 2025
