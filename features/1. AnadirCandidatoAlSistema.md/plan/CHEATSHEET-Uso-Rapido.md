# 🚀 CHEAT SHEET - Uso Rápido de los Documentos de Plan

## ⚡ Respuesta Rápida a tu Pregunta

### ❓ "¿El FRD y Design System solo sirven para documentar?"

**❌ NO.** Son **inputs obligatorios** para el desarrollo.

### 📊 Flujo Completo

```
PASO 1 → Genera FRD (Product Owner)           [Modo Normal]
PASO 2 → Genera Design System (UX/UI)         [Modo Normal]
         ↓
         📄 Guarda estos archivos .md
         ↓
PASO 3 → Desarrollo Frontend                   [Modo Agente]
         (usa FRD + Design System como contexto)
         ↓
PASO 4 → Desarrollo Backend                    [Modo Agente]
         (usa FRD como contexto)
```

---

## 🎯 Cómo Usar los Documentos

### Documentación (Pasos 1-2)

| Documento | Generar con | Guardar como | Usar en |
|-----------|-------------|--------------|---------|
| FRD | 01-ProductOwner-Requirements.md | `AnadirCandidato-FRD.md` | Frontend + Backend |
| Design | 02-UX-UI-Designer-Design-Specs.md | `AnadirCandidato-Design.md` | Frontend |

### Desarrollo (Pasos 3-4)

**ANTES de codificar, prepara tu prompt:**

```
┌─────────────────────────────────────────────────┐
│ TU PROMPT COMPLETO DEBE TENER:                  │
├─────────────────────────────────────────────────┤
│ 1. Documento de prompting (03 o 04)             │
│ 2. Extractos del FRD ← IMPORTANTE               │
│ 3. Extractos del Design System (si frontend)    │
│ 4. Contexto de tu proyecto (stack, estructura)  │
└─────────────────────────────────────────────────┘
```

---

## 📝 Plantilla de Prompt para Frontend

```
Estoy implementando [NOMBRE_COMPONENTE] en React + TypeScript.

📄 REQUISITOS (del FRD - AnadirCandidato-FRD.md):
[COPIA las validaciones, campos obligatorios, mensajes de error]

🎨 DISEÑO (del Design System - AnadirCandidato-Design.md):
[COPIA colores, tamaños, animaciones, estados]

Stack: React 18, TypeScript 5, [OTRAS LIBS]
Arquitectura: [TU ARQUITECTURA]

[LUEGO COPIA EL CONTENIDO DE 03-Frontend-Developer-React-Implementation.md]

Genera [COMPONENTE ESPECÍFICO] siguiendo estas especificaciones.
```

### Ejemplo Concreto - TextField

```
Estoy implementando TextField en React + TypeScript.

📄 REQUISITOS (del FRD):
- Validación de email: RFC 5322 regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Validación de teléfono: E.164 formato +[código país][número]
- Mensajes de error en español, específicos
- Validación en onBlur (no mientras escribe)

🎨 DISEÑO (del Design System):
Colores:
  Primary: #0066CC
  Error: #E63946
  Success: #00B050

Tamaños:
  Height: 48px mobile, 40px desktop
  Padding: 16px horizontal
  Border radius: 8px

Animaciones:
  Focus: border 1px → 2px, color neutral → primary, 200ms ease-in-out
  Error: shake 400ms + border rojo

Estados:
  - default, focus, filled, error, disabled, valid

Accesibilidad:
  - aria-invalid cuando hay error
  - aria-describedby para mensajes de error

Stack: React 18, TypeScript 5, clsx para clases
Arquitectura: Atomic Design

[COPIAR CONTENIDO DE 03-Frontend-Developer-React-Implementation.md
 SECCIÓN 4.5 TextField Component]

Genera el componente completo con todos sus estados.
```

---

## 📝 Plantilla de Prompt para Backend

```
Estoy implementando la API para [NOMBRE_ENDPOINT].

📄 REQUISITOS (del FRD - AnadirCandidato-FRD.md):
[COPIA endpoints, validaciones, códigos de respuesta, casos de error]

Stack: Node.js + TypeScript, Express, Prisma ORM, PostgreSQL
Arquitectura: Repository → Service → Controller

[LUEGO COPIA EL CONTENIDO DE 04-Backend-Developer-API-Implementation.md]

Genera [CAPA ESPECÍFICA] siguiendo estas especificaciones.
```

### Ejemplo Concreto - CandidateService

```
Estoy implementando CandidateService para crear candidatos.

📄 REQUISITOS (del FRD):
Endpoint: POST /api/v1/candidates

Validaciones:
- Email único en BD (verificar ANTES de insertar)
- firstName/lastName: min 2, max 50, solo letras
- Phone: formato E.164
- CV: opcional, PDF/DOCX, max 5MB

Respuestas:
- 201 Created: { success: true, data: Candidate, message: "..." }
- 409 Conflict: Email duplicado → mensaje específico
- 400 Bad Request: Validación fallida → detalles por campo
- 401 Unauthorized: Sin autenticación

Reglas de negocio:
- Loggear cada creación (userId, candidateId)
- Soft delete (no hard delete)
- Solo ver candidatos propios (createdBy = userId)

Stack: Node.js + TS, Express, Prisma ORM, Zod validation
Arquitectura: Repository → Service → Controller

[COPIAR CONTENIDO DE 04-Backend-Developer-API-Implementation.md
 SECCIÓN 6 Service Layer]

Genera el CandidateService completo con manejo de errores.
```

---

## 🎨 Qué Copiar de Cada Documento

### Del FRD (AnadirCandidato-FRD.md)

✅ **Para Frontend:**

- Campos del formulario y tipos
- Validaciones (regex, límites de caracteres)
- Mensajes de error específicos
- Casos de uso (para tests)

✅ **Para Backend:**

- Schema de BD (campos, tipos, constraints)
- Validaciones (mismas que frontend)
- Endpoints y respuestas
- Códigos de error y mensajes
- Reglas de negocio

### Del Design System (AnadirCandidato-Design.md)

✅ **Para Frontend:**

- Design tokens (colores, tipografía, spacing)
- Tamaños de componentes
- Animaciones y transiciones
- Estados visuales (hover, focus, error)
- Breakpoints responsive

---

## ⚡ Atajos Rápidos

### Al Generar Componentes

1. Abre `AnadirCandidato-Design.md`
2. Busca la sección del componente (Ctrl+F)
3. Copia tokens relevantes (colores, tamaños)
4. Pégalos en tu prompt con modo agente

### Al Generar API

1. Abre `AnadirCandidato-FRD.md`
2. Busca criterios de aceptación del endpoint
3. Copia validaciones y respuestas esperadas
4. Pégalos en tu prompt con modo agente

### Al Generar Tests

1. Abre `AnadirCandidato-FRD.md`
2. Busca "Casos de Uso"
3. Cada caso de uso = 1 test
4. Copia escenarios y resultados esperados

---

## 🔥 Errores Comunes y Soluciones

### ❌ Error: "El código generado no coincide con el diseño"

**Causa:** No incluiste extractos del Design System en tu prompt.
**Solución:** Copia la sección 4.1 (Design Tokens) del Design System.

### ❌ Error: "Las validaciones del frontend no coinciden con backend"

**Causa:** Generaste cada uno con prompts diferentes.
**Solución:** Usa el MISMO extracto del FRD para ambos.

### ❌ Error: "Los tests fallan porque esperan otras respuestas"

**Causa:** Los tests se generaron sin conocer el contrato de API.
**Solución:** Incluye la sección de respuestas del FRD al generar tests.

### ❌ Error: "El componente no es accesible"

**Causa:** No incluiste las especificaciones de accesibilidad.
**Solución:** Copia la sección 7 (Accesibilidad) del Design System.

---

## 📋 Checklist Rápido

Antes de pedir código al modo agente, verifica:

- [ ] ¿Tengo el FRD generado y guardado?
- [ ] ¿Tengo el Design System generado y guardado? (si es frontend)
- [ ] ¿Copié extractos relevantes del FRD en mi prompt?
- [ ] ¿Copié extractos del Design System en mi prompt? (si es frontend)
- [ ] ¿Incluí el documento de prompting completo (03 o 04)?
- [ ] ¿Especifiqué qué componente/capa quiero generar?
- [ ] ¿Mencioné mi stack tecnológico específico?

Si todos están ✅, ¡adelante con el modo agente! 🚀

---

## 🎯 Resumen de 30 Segundos

1. **Genera FRD y Design** (modo normal, guarda como .md)
2. **Al codificar** (modo agente): Copia documento prompting + extractos FRD/Design
3. **No son solo documentación**: Son tu contrato de implementación
4. **Regla de oro**: Mismas validaciones en frontend y backend (usa el FRD)

**¿Duda rápida?** Revisa la sección "Ejemplos Prácticos" de la guía completa (00-GUIA-DE-USO-DEL-PLAN.md).

---

**💡 Pro Tip:** Crea una carpeta `docs/` con el FRD y Design System. Ábrelos en VS Code en otra ventana mientras codificas. Copy-paste según necesites.
