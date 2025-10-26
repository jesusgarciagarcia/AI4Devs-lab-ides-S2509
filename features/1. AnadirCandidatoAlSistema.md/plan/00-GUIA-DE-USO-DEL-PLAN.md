# 📚 Guía de Uso del Plan de Desarrollo

## 🎯 Objetivo de esta Guía

Esta guía te ayudará a utilizar eficientemente los 4 documentos de planificación generados para implementar la feature "Añadir Candidato al Sistema" en diferentes sesiones de chat con IA, ya sea con o sin contexto previo.

---

## 📋 Resumen de los Documentos Generados

Has generado **4 perfiles expertos** con sus respectivos documentos de prompting:

1. **01-ProductOwner-Requirements.md** - Refinamiento de requisitos funcionales y especificaciones
2. **02-UX-UI-Designer-Design-Specs.md** - Diseño de interfaz y experiencia de usuario
3. **03-Frontend-Developer-React-Implementation.md** - Implementación del formulario en React + TypeScript
4. **04-Backend-Developer-API-Implementation.md** - Implementación de la API REST en Node.js + TypeScript

---

## 🚀 Cómo Utilizar Cada Documento

### 📝 Opción A: Chat SIN Contexto Previo (Recomendado para comenzar)

#### **Paso 1: Product Owner - Refinamiento de Requisitos**

**¿Cuándo usar?** Al inicio del proyecto para definir claramente los requisitos.

**Modo recomendado:** ✅ **Modo Normal** (no agente)

**Cómo usarlo:**

1. **Abre un chat nuevo** con tu IA preferida (GitHub Copilot, ChatGPT, Claude, etc.)

2. **Copia y pega el contenido COMPLETO** del archivo `01-ProductOwner-Requirements.md`

3. **Añade al final este mensaje:**

   ```
   Por favor, genera el documento completo de requisitos funcionales siguiendo
   todas las especificaciones indicadas en el prompt anterior. Asegúrate de cubrir
   todas las secciones de la estructura lógica del documento.
   ```

4. **Revisa el output** y solicita ajustes si es necesario:
   - "Añade más detalles a la sección de casos de uso"
   - "Amplía los criterios de aceptación con ejemplos concretos"
   - "Incluye una matriz de decisiones para la tecnología de upload de archivos"

5. **Guarda el resultado** en un nuevo archivo (por ejemplo: `AnadirCandidato-FRD.md`)

**⏱️ Tiempo estimado:** 5-10 minutos

---

#### **Paso 2: UX/UI Designer - Diseño de Interfaz**

**¿Cuándo usar?** Después de tener los requisitos claros del Product Owner.

**Modo recomendado:** ✅ **Modo Normal** (no agente)

**Cómo usarlo:**

1. **Abre un chat nuevo** (puedes usar el mismo si tiene contexto de los requisitos)

2. **Si es un chat nuevo SIN contexto:**
   - Primero, proporciona contexto breve:

     ```
     Estoy trabajando en una feature de ATS (Applicant Tracking System) para
     añadir candidatos. Los requisitos principales son: formulario con 7 campos
     obligatorios (nombre, apellido, email, teléfono, dirección, educación,
     experiencia) + upload de CV en PDF/DOCX max 5MB.

     Stack: React + TypeScript (frontend), responsive design obligatorio.
     ```

3. **Luego, copia y pega el contenido COMPLETO** del archivo `02-UX-UI-Designer-Design-Specs.md`

4. **Añade al final:**

   ```
   Por favor, genera el documento completo de diseño UX/UI siguiendo todas
   las especificaciones. Incluye descripciones detalladas de wireframes en
   formato ASCII art y especificaciones de componentes.
   ```

5. **Iteraciones útiles:**
   - "Genera los wireframes para la vista tablet"
   - "Amplía la sección de micro-interacciones con más ejemplos"
   - "Añade especificaciones para el estado de loading del formulario"

6. **Guarda el resultado** en: `AnadirCandidato-UX-Design.md`

**⏱️ Tiempo estimado:** 10-15 minutos

---

#### **Paso 3: Frontend Developer - Implementación React**

**¿Cuándo usar?** Cuando tengas claros los requisitos Y el diseño.

**Modo recomendado:** ⚠️ **Modo Agente** (si está disponible) o Modo Normal con iteraciones

**¿Por qué modo agente?** Porque necesitarás:

- Crear múltiples archivos de componentes
- Instalar dependencias
- Ejecutar tests
- Ver errores de compilación en tiempo real

**🎯 IMPORTANTE: Cómo usar el FRD y Design System aquí**

Los documentos generados en los Pasos 1 y 2 NO son solo para documentar, **son la guía de referencia** durante el desarrollo. Úsalos así:

**Antes de empezar a codificar:**

1. **Abre los archivos generados en VS Code:**
   - `AnadirCandidato-FRD.md` (del Paso 1)
   - `AnadirCandidato-UX-Design.md` (del Paso 2)

2. **Añádelos como contexto al Modo Agente:**
   - En VS Code, abre el chat de Copilot
   - Usa `@workspace` para referenciar archivos
   - O menciona explícitamente: "Usando los requisitos del archivo AnadirCandidato-FRD.md..."

**Cómo usarlo:**

1. **Abre GitHub Copilot en VS Code** (o tu IDE con soporte de IA)

2. **🔑 Proporciona contexto COMPLETO con los documentos generados:**

   ```
   Estoy implementando un formulario de "Añadir Candidato" en React + TypeScript.

   📄 CONTEXTO DE REQUISITOS (del FRD):
   - 7 campos obligatorios: firstName, lastName, email, phone, address, education, experience
   - Upload de CV: PDF/DOCX max 5MB
   - Validaciones: email RFC 5322, teléfono E.164
   - Confirmación al guardar exitosamente
   - Manejo de errores de red con opción de reintentar

   🎨 CONTEXTO DE DISEÑO (del Design System):
   - Colores: Primary #0066CC, Error #E63946, Success #00B050
   - Typography: Body 16px, Heading-2 24px
   - Spacing: md=16px, lg=24px
   - Inputs: 48px height mobile, 40px desktop
   - Validación onBlur (no mientras escribe)
   - Animaciones: 200-300ms ease-in-out
   - Accesibilidad: WCAG 2.1 AA, contraste 4.5:1

   Stack: React 18, TypeScript 5, Zod validation, React Hook Form
   Arquitectura: Atomic Design (atoms → molecules → organisms)
   ```

   💡 **Tip:** Copia las secciones relevantes del FRD y Design System directamente en tu prompt.

3. **Luego, copia el contenido del archivo** `03-Frontend-Developer-React-Implementation.md`

4. **Solicita generación por fases:**

   **Fase 1 - Setup y Types:**

   ```
   Primero, genera los archivos de types y schemas de validación:
   - types/candidate.types.ts
   - schemas/candidateSchema.ts
   ```

   **Fase 2 - Custom Hooks:**

   ```
   Ahora genera los custom hooks:
   - hooks/useFormValidation.ts
   - hooks/useFileUpload.ts
   ```

   **Fase 3 - Componentes Atómicos:**

   ```
   Genera los componentes atómicos:
   - components/atoms/TextField/TextField.tsx
   - components/atoms/Button/Button.tsx
   ```

   **Fase 4 - Componentes de Sección:**

   ```
   Genera las secciones del formulario:
   - components/organisms/PersonalInfoSection.tsx
   - components/organisms/DocumentSection.tsx
   ```

   **Fase 5 - Componente Principal:**

   ```
   Finalmente, genera el componente principal:
   - components/organisms/AddCandidateForm/AddCandidateForm.tsx
   ```

   **Fase 6 - Tests:**

   ```
   Genera los tests para cada componente siguiendo el documento.
   ```

5. **Verifica compilación y ejecuta tests** después de cada fase

**⏱️ Tiempo estimado:** 30-60 minutos (por la cantidad de archivos)

---

#### **Paso 4: Backend Developer - Implementación API**

**¿Cuándo usar?** En paralelo con el frontend o después.

**Modo recomendado:** ⚠️ **Modo Agente** (si está disponible)

**¿Por qué modo agente?** Porque necesitarás:

- Crear estructura de carpetas compleja
- Ejecutar migraciones de Prisma
- Instalar dependencias npm
- Ejecutar tests de integración

**🎯 IMPORTANTE: Cómo usar el FRD aquí**

El FRD generado en el Paso 1 es tu **contrato de API**. Define exactamente qué endpoints crear, qué validaciones aplicar y qué respuestas devolver.

**Cómo usarlo:**

1. **Abre GitHub Copilot en VS Code** en la carpeta `backend/`

2. **🔑 Proporciona contexto COMPLETO con los requisitos:**

   ```
   Estoy implementando el backend de un ATS para añadir candidatos.

   📄 CONTEXTO DE REQUISITOS (del FRD):
   - Endpoint: POST /api/v1/candidates
   - Campos obligatorios: firstName, lastName, email, phone, address, education, experience
   - Validaciones críticas:
     * Email: RFC 5322, único en BD
     * Teléfono: formato E.164 internacional
     * CV: PDF/DOCX, max 5MB, upload opcional
   - Response 201 con datos del candidato creado
   - Error 409 si email duplicado
   - Error 400 con detalles específicos de validación
   - Autenticación JWT obligatoria
   - Soft delete (no hard delete)

   Stack:
   - Node.js + TypeScript
   - Express
   - Prisma ORM + PostgreSQL
   - Validación con Zod
   - JWT auth
   - Multer para file upload

   Arquitectura: Repository → Service → Controller (layered architecture)
   SOLID principles obligatorios
   ```

   💡 **Tip:** El FRD tiene los casos de uso y criterios de aceptación. Úsalos para definir los tests de integración.

3. **Copia el contenido del archivo** `04-Backend-Developer-API-Implementation.md`

4. **Solicita generación por fases:**

   **Fase 1 - Prisma Schema:**

   ```
   Primero, actualiza el schema de Prisma con el modelo Candidate según el documento.
   Genera también la migración.
   ```

   **Fase 2 - DTOs y Validación:**

   ```
   Genera los DTOs y schemas de validación:
   - modules/candidates/candidate.dto.ts
   ```

   **Fase 3 - Repository:**

   ```
   Genera el repository layer:
   - modules/candidates/candidate.repository.ts
   ```

   **Fase 4 - Service:**

   ```
   Genera el service layer con toda la lógica de negocio:
   - modules/candidates/candidate.service.ts
   ```

   **Fase 5 - Controller:**

   ```
   Genera el controller:
   - modules/candidates/candidate.controller.ts
   ```

   **Fase 6 - Middlewares:**

   ```
   Genera los middlewares:
   - middlewares/validation.middleware.ts
   - middlewares/fileUpload.middleware.ts
   - middlewares/errorHandler.middleware.ts
   ```

   **Fase 7 - Routes:**

   ```
   Genera el archivo de rutas:
   - modules/candidates/candidate.routes.ts
   ```

   **Fase 8 - Tests:**

   ```
   Genera los tests unitarios y de integración según el documento.
   ```

5. **Ejecuta los tests** después de cada fase importante

**⏱️ Tiempo estimado:** 45-90 minutos

---

## 🔄 Opción B: Chat CON Contexto Previo

Si estás trabajando en **el mismo chat** donde ya generaste los documentos:

### Uso Simplificado

1. **Referencia el documento anterior:**

   ```
   Basándote en el documento "01-ProductOwner-Requirements.md" que generamos,
   ahora actúa como el Product Owner y genera el documento completo de requisitos
   funcionales.
   ```

2. **O pide implementación directa:**

   ```
   Ahora vamos a la fase de implementación frontend. Usando el documento
   "03-Frontend-Developer-React-Implementation.md" como guía, genera el código
   del componente TextField con todos sus tests.
   ```

**✅ Ventaja:** No necesitas copiar todo el prompt de nuevo.

**⚠️ Desventaja:** El contexto puede "diluirse" si la conversación es muy larga.

---

## � El Flujo Completo: De Documentos a Código

### 📋 Visualización del Flujo

```
Paso 1 (Modo Normal)          Paso 2 (Modo Normal)
┌────────────────────┐        ┌────────────────────┐
│ Product Owner      │        │ UX/UI Designer     │
│ Prompt Doc         │        │ Prompt Doc         │
└────────┬───────────┘        └────────┬───────────┘
         │                              │
         ▼                              ▼
   [GENERAR FRD]               [GENERAR DESIGN]
         │                              │
         ▼                              ▼
┌─────────────────────────────────────────────────┐
│ 📄 AnadirCandidato-FRD.md                       │
│    - Requisitos funcionales                     │
│    - Criterios de aceptación                    │
│    - Casos de uso                               │
│    - Validaciones específicas                   │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│ 🎨 AnadirCandidato-UX-Design.md                 │
│    - Wireframes (ASCII art)                     │
│    - Design tokens (colores, tipografía)        │
│    - Componentes UI                             │
│    - Interacciones y animaciones                │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
 Paso 3 (Modo Agente)     Paso 4 (Modo Agente)
┌────────────────────┐    ┌────────────────────┐
│ Frontend Dev       │    │ Backend Dev        │
│ + FRD + Design     │    │ + FRD              │
└────────┬───────────┘    └────────┬───────────┘
         │                          │
         ▼                          ▼
   [GENERAR CÓDIGO]          [GENERAR CÓDIGO]
         │                          │
         ▼                          ▼
┌─────────────────────┐    ┌─────────────────────┐
│ ⚛️ React Components │    │ 🔧 API REST         │
│   - Types           │    │   - Prisma Schema   │
│   - Hooks           │    │   - DTOs            │
│   - Components      │    │   - Repository      │
│   - Tests           │    │   - Service         │
└─────────────────────┘    │   - Controller      │
                           │   - Middlewares     │
                           │   - Tests           │
                           └─────────────────────┘
```

### 🎯 Cómo los Documentos Se Usan en el Desarrollo

#### **FRD (Functional Requirements Document) se usa para:**

✅ **En Frontend:**

- Definir los tipos TypeScript (interfaces de Candidate)
- Configurar validaciones en Zod (mismas reglas que backend)
- Crear mensajes de error específicos
- Implementar estados de la UI (loading, success, error)
- Escribir casos de test basados en los criterios de aceptación

**Ejemplo práctico:**

```
Del FRD: "El email debe validarse según RFC 5322"
En código: const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

✅ **En Backend:**

- Diseñar el schema de Prisma (campos, tipos, constraints)
- Crear DTOs de validación (Zod schemas idénticos a frontend)
- Implementar lógica de negocio del Service
- Definir respuestas de API (códigos, mensajes, estructura)
- Escribir tests de integración basados en casos de uso

**Ejemplo práctico:**

```
Del FRD: "Error 409 si el email ya existe"
En código: throw new ConflictError('Ya existe un candidato con este email');
```

#### **Design System se usa para:**

✅ **En Frontend:**

- Crear design tokens (CSS variables o Tailwind config)
- Implementar componentes con estilos exactos
- Definir animaciones y transiciones
- Configurar breakpoints responsive
- Implementar estados visuales (hover, focus, error)

**Ejemplo práctico:**

```
Del Design: "Input height: 48px mobile, 40px desktop"
En código:
<input className="h-12 md:h-10" /> // Tailwind
o
.input { height: 48px; @media (min-width: 768px) { height: 40px; } }
```

✅ **En Backend (indirectamente):**

- Los tamaños de archivo en el Design (5MB max) → configurar Multer
- Estados de respuesta visuales → códigos HTTP correspondientes
- Tiempos de timeout del UI → configurar timeouts del servidor

---

## Resumen: ¿Qué Modo Usar?

| Fase | Documento | Modo Recomendado | Razón | Documentos de Referencia |
|------|-----------|------------------|-------|--------------------------|
| 1 | Product Owner | 🟢 **Normal** | Solo genera documentación markdown | Feature original |
| 2 | UX/UI Designer | 🟢 **Normal** | Solo genera documentación markdown | Feature + FRD |
| 3 | Frontend Dev | 🔴 **Agente** | Crea múltiples archivos + ejecuta tests | **FRD + Design System** |
| 4 | Backend Dev | 🔴 **Agente** | Crea archivos + ejecuta migraciones + tests | **FRD** |

**💡 Nota importante:** Los documentos FRD y Design System NO son solo para documentar, son **inputs críticos** para el desarrollo en las fases 3 y 4.

---

## 🔥 Ejemplos Prácticos de Uso de Documentos

### Ejemplo 1: Generando un Componente con el Design System

**Situación:** Estás en modo agente, generando el componente TextField.

**Mal enfoque (sin usar Design System):**

```
Genera un componente TextField en React con TypeScript.
```

❌ Resultado: Componente genérico sin estilos específicos.

**Buen enfoque (usando Design System):**

```
Genera el componente TextField en React + TypeScript según estas especificaciones
del Design System:

- Height: 48px mobile (h-12), 40px desktop (md:h-10)
- Border: 1px solid neutral-300 por defecto
- Focus: 2px solid primary (#0066CC), transición 200ms ease-in-out
- Error: 2px solid error (#E63946) + shake animation 400ms
- Padding: 16px horizontal
- Font: 16px, line-height 24px
- Border radius: 8px
- Colores del archivo AnadirCandidato-UX-Design.md sección 4.1

Incluye:
- Props: label, error, helperText, isValid
- Estados: default, focus, error, disabled, valid
- Accesibilidad: aria-invalid, aria-describedby
- Validación visual en onBlur
```

✅ Resultado: Componente pixel-perfect según las especificaciones.

### Ejemplo 2: Generando Validación con el FRD

**Situación:** Estás generando el schema de validación Zod.

**Mal enfoque (sin usar FRD):**

```
Genera un schema Zod para validar un candidato con email y teléfono.
```

❌ Resultado: Validaciones genéricas, inconsistentes con el backend.

**Buen enfoque (usando FRD):**

```
Genera el schema Zod para validar un candidato según el FRD
(AnadirCandidato-FRD.md):

Validaciones específicas del documento:
- firstName: min 2, max 50, solo letras incluyendo áéíóúñ
- lastName: min 2, max 50, solo letras incluyendo áéíóúñ
- email: RFC 5322 regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/, unique en BD
- phone: E.164 formato /^\+?[1-9]\d{1,14}$/, ejemplo +34612345678
- address: min 10, max 200 caracteres
- education: min 10, max 1000 caracteres
- experience: min 10, max 2000 caracteres
- cvFile: File, max 5MB, tipos: application/pdf o application/vnd.openxmlformats-*

Mensajes de error en español, específicos (no genéricos como "invalid").
```

✅ Resultado: Validaciones exactas, sincronizadas con el backend.

### Ejemplo 3: Generando Endpoints del Backend con el FRD

**Situación:** Estás generando el controller del backend.

**Mal enfoque (sin usar FRD):**

```
Genera un controller para crear candidatos en Express + TypeScript.
```

❌ Resultado: Respuestas inconsistentes, códigos HTTP arbitrarios.

**Buen enfoque (usando FRD):**

```
Genera el CandidateController siguiendo el contrato de API del FRD:

POST /api/v1/candidates:
- Input: CreateCandidateDto (ya definido)
- Success: 201 Created
  Response: { success: true, data: Candidate, message: "Candidato creado exitosamente" }
- Error 409 Conflict: Email duplicado
  Response: { success: false, error: { code: "CONFLICT", message: "Ya existe un candidato con este email" } }
- Error 400 Bad Request: Validación fallida
  Response: { success: false, error: { code: "VALIDATION_ERROR", message: "...", details: [] } }
- Error 401 Unauthorized: Sin auth token
- Error 500 Internal Server Error: Otros errores

Requisitos del FRD:
- Autenticación JWT obligatoria (verificar en middleware)
- Loggear cada creación con userId y candidateId
- Verificar email único ANTES de insertar
- Aplicar validación Zod ANTES de lógica de negocio
```

✅ Resultado: API consistente con el contrato definido.

---

## 🎯 Estrategia Recomendada para las 3 Tareas

Asumiendo que tienes **3 tareas** a resolver:

### ✅ **Tarea 1: Definición y Diseño (Documentación)**

**Objetivo:** Tener especificaciones claras antes de codificar.

**Chats necesarios:** 1-2

**Proceso:**

1. **Chat 1 (Modo Normal):**
   - Usa `01-ProductOwner-Requirements.md` → Genera FRD completo
   - Usa `02-UX-UI-Designer-Design-Specs.md` → Genera especificaciones de diseño

**Entregables:**

- `AnadirCandidato-FRD.md` (Functional Requirements Document)
- `AnadirCandidato-UX-Design.md` (UX/UI Specifications)

**⏱️ Tiempo:** 20-30 minutos

---

### ✅ **Tarea 2: Implementación Frontend**

**Objetivo:** Código completo del formulario React + TypeScript.

**Chats necesarios:** 1 (con modo agente)

**Proceso:**

1. **Chat con Modo Agente en VS Code:**
   - Proporciona contexto breve (requisitos + diseño)
   - Usa `03-Frontend-Developer-React-Implementation.md`
   - Genera código por fases (types → hooks → components → tests)
   - Ejecuta y verifica tests después de cada fase

**Entregables:**

- Todos los archivos de componentes
- Custom hooks
- Tests con >80% coverage
- Formulario funcional y responsive

**⏱️ Tiempo:** 45-75 minutos

---

### ✅ **Tarea 3: Implementación Backend**

**Objetivo:** API REST completa con validaciones, seguridad y tests.

**Chats necesarios:** 1 (con modo agente)

**Proceso:**

1. **Chat con Modo Agente en VS Code:**
   - Proporciona contexto breve (stack tecnológico)
   - Usa `04-Backend-Developer-API-Implementation.md`
   - Genera código por capas (schema → DTOs → repository → service → controller)
   - Ejecuta migraciones y tests

**Entregables:**

- Prisma schema actualizado
- API REST completa (CRUD + file upload)
- Middlewares de validación y seguridad
- Tests unitarios e integración

**⏱️ Tiempo:** 60-90 minutos

---

## 💡 Tips y Mejores Prácticas

### ✅ DO's (Hacer)

1. **Usa contexto incremental:**
   - No copies todo el prompt de golpe si es muy largo
   - Proporciona contexto general primero, luego el prompt específico

2. **Genera por fases:**
   - No pidas todo el código de una vez
   - Ve fase por fase: types → utils → components → tests

3. **Verifica antes de continuar:**
   - Compila y ejecuta tests después de cada fase
   - Corrige errores antes de seguir adelante

4. **Guarda los outputs:**
   - Crea archivos markdown con los documentos generados
   - Facilita la referencia futura

5. **Itera y refina:**
   - Los prompts son guías, no camisas de fuerza
   - Pide ajustes específicos según tus necesidades

### ❌ DON'Ts (No hacer)

1. **No mezcles roles:**
   - No pidas al Product Owner que genere código
   - Cada documento tiene su propósito específico

2. **No omitas el contexto:**
   - Aunque el prompt sea completo, añade contexto breve del proyecto
   - Especialmente importante en chats nuevos

3. **No generes todo de golpe:**
   - No pidas "genera todo el frontend" sin fases
   - Será difícil de revisar y depurar

4. **No ignores los errores:**
   - Si hay errores de compilación, resuélvelos antes de continuar
   - El modo agente puede ayudarte a verlos

5. **No uses siempre el mismo chat:**
   - Los chats muy largos pierden contexto
   - Inicia nuevos chats para cada fase principal

---

## 🔧 Troubleshooting

### Problema: "El output es muy genérico"

**Solución:** Añade más contexto específico de tu proyecto antes del prompt.

### Problema: "El código generado tiene errores de TypeScript"

**Solución:** Asegúrate de que el IA conozca tu versión de TypeScript y las dependencias instaladas.

### Problema: "Los tests no compilan"

**Solución:** Genera primero el código de producción, luego los tests. Proporciona imports específicos.

### Problema: "El prompt es demasiado largo y se corta"

**Solución:** Divide el prompt en secciones. Envía primero la estructura, luego pide cada sección.

### Problema: "No tengo modo agente disponible"

**Solución:** Usa modo normal y copia/pega el código generado manualmente. Luego usa el IA para revisar errores.

---

## 📚 Checklist de Ejecución

Usa este checklist para asegurar que completas todo:

### Tarea 1: Documentación

- [ ] FRD completo con criterios de aceptación
- [ ] User stories en formato INVEST
- [ ] Casos de uso (happy path + edge cases)
- [ ] Wireframes descritos (desktop + mobile)
- [ ] Sistema de componentes especificado
- [ ] Especificaciones de accesibilidad

### Tarea 2: Frontend

- [ ] Types y interfaces definidos
- [ ] Schemas de validación con Zod
- [ ] Custom hooks implementados
- [ ] Componentes atómicos creados
- [ ] Formulario principal funcional
- [ ] Validación en tiempo real funcionando
- [ ] File upload implementado
- [ ] Responsive design verificado
- [ ] Tests unitarios >80% coverage
- [ ] Tests de integración del formulario

### Tarea 3: Backend

- [ ] Prisma schema actualizado
- [ ] Migraciones ejecutadas
- [ ] DTOs y validación implementados
- [ ] Repository layer completo
- [ ] Service layer con lógica de negocio
- [ ] Controllers implementados
- [ ] Middlewares de validación
- [ ] Middleware de file upload
- [ ] Error handling robusto
- [ ] Routes configuradas
- [ ] Tests unitarios de service
- [ ] Tests de integración de API
- [ ] Postman/Thunder Client collection (opcional)

---

## 🎓 Conclusión

Estos documentos son **plantillas de prompting profesionales** diseñadas para guiar a la IA hacia outputs de alta calidad. Úsalos como:

1. **Guías de referencia** cuando trabajes con IA
2. **Checklists** de lo que debe incluirse
3. **Documentación** para tu equipo sobre estándares

**Recuerda:** La IA es una herramienta poderosa, pero **tú eres el arquitecto**. Revisa, itera y ajusta según las necesidades específicas de tu proyecto.

---

## 📋 TL;DR - Resumen Ejecutivo

### ¿Los documentos FRD y Design System son solo para documentar?

**❌ NO.** Son **documentos de referencia activos** que debes usar durante el desarrollo.

### Flujo Correcto

1. **Paso 1-2 (Modo Normal):** Genera FRD + Design System → Guárdalos como archivos .md
2. **Paso 3-4 (Modo Agente):** Copia extractos relevantes del FRD/Design como contexto inicial
3. **Durante desarrollo:** Consulta constantemente los documentos para mantener consistencia

### La Fórmula Ganadora

```
Prompt Completo =
  Documento de Prompting (01-04)
  +
  Extractos del FRD (requisitos, validaciones, casos de uso)
  +
  Extractos del Design System (tokens, componentes, interacciones)
  +
  Contexto específico del proyecto (stack, estructura)
```

### Ejemplo de Uso Real

**Al generar TextField.tsx:**

```
1. Abre 03-Frontend-Developer-React-Implementation.md (guía técnica)
2. Copia sección de TextField del documento
3. AÑADE: extractos de Design System (colores, tamaños, animaciones)
4. AÑADE: extractos de FRD (validaciones, mensajes de error)
5. Pide al modo agente que genere el componente
```

**Resultado:** Componente completo, consistente con diseño y requisitos, listo para producción.

---

## 📞 Siguiente Paso

**¿Listo para comenzar?**

1. Decide qué tarea atacar primero (recomiendo: Documentación → Frontend → Backend)
2. Abre el chat correspondiente (normal o agente según la tabla)
3. Copia el documento relevante + extractos del FRD/Design si aplica
4. ¡Genera y verifica!

**💡 Regla de Oro:** Nunca empieces a codificar (Paso 3-4) sin tener los documentos del Paso 1-2. Son tu **contrato de implementación**.

**¡Éxito en tu implementación! 🚀**

1. **Guías de referencia** cuando trabajes con IA
2. **Checklists** de lo que debe incluirse
3. **Documentación** para tu equipo sobre estándares

**Recuerda:** La IA es una herramienta poderosa, pero **tú eres el arquitecto**. Revisa, itera y ajusta según las necesidades específicas de tu proyecto.

---

## 📞 Siguiente Paso

**¿Listo para comenzar?**

1. Decide qué tarea atacar primero (recomiendo: Documentación → Frontend → Backend)
2. Abre el chat correspondiente (normal o agente según la tabla)
3. Copia el documento relevante
4. ¡Genera y verifica!

**¡Éxito en tu implementación! 🚀**
