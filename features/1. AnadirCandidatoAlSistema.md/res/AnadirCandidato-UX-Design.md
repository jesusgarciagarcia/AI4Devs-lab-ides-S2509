# 🎨 **FormulARTE! - Diseño UX/UI del Formulario "Añadir Candidato al Sistema"**

**Versión:** 1.0
**Fecha:** 2025-10-26
**Autor:** UX/UI Design Team

---

## 🧭 Tabla de Contenidos

- [🎨 **FormulARTE! - Diseño UX/UI del Formulario "Añadir Candidato al Sistema"**](#-formularte---diseño-uxui-del-formulario-añadir-candidato-al-sistema)
  - [🧭 Tabla de Contenidos](#-tabla-de-contenidos)
  - [1. Research y Análisis de Usuario](#1-research-y-análisis-de-usuario)
    - [👩‍💼 Persona Principal](#-persona-principal)
    - [🗺️ User Journey Map](#️-user-journey-map)
  - [2. Arquitectura de Información](#2-arquitectura-de-información)
    - [2.1 Estructura del Formulario](#21-estructura-del-formulario)
    - [2.2 Flujo de Información](#22-flujo-de-información)
  - [3. Wireframes Detallados](#3-wireframes-detallados)
    - [3.1 Vista Desktop (1920x1080)](#31-vista-desktop-1920x1080)
      - [📄 Documentación (Subida de CV)](#-documentación-subida-de-cv)
    - [3.2 Vista Mobile (375x667)](#32-vista-mobile-375x667)
  - [4. Sistema de Diseño y Componentes](#4-sistema-de-diseño-y-componentes)
    - [4.1 Design Tokens (resumen visual)](#41-design-tokens-resumen-visual)
    - [4.2 Componentes Reutilizables](#42-componentes-reutilizables)
      - [**Input Field**](#input-field)
      - [**Button**](#button)
      - [**File Upload**](#file-upload)
  - [5. Estados e Interacciones](#5-estados-e-interacciones)
    - [5.1 Estados del Formulario](#51-estados-del-formulario)
    - [5.2 Micro-interacciones](#52-micro-interacciones)
  - [6. Validación Visual](#6-validación-visual)
    - [6.1 Inline Validation](#61-inline-validation)
    - [6.2 Acciones Correctivas](#62-acciones-correctivas)
  - [7. Accesibilidad (WCAG 2.1 Level AA)](#7-accesibilidad-wcag-21-level-aa)
  - [8. Responsive Design](#8-responsive-design)
  - [9. Performance y Carga](#9-performance-y-carga)
  - [10. Casos de Error y Empty States](#10-casos-de-error-y-empty-states)
    - [10.1 Error de Red](#101-error-de-red)
    - [10.2 Resumen de Errores](#102-resumen-de-errores)
  - [11. Design Tokens JSON](#11-design-tokens-json)
  - [12. Prototype Flow Description](#12-prototype-flow-description)
    - [🧭 Paso a Paso](#-paso-a-paso)
    - [🔄 Estados de Error](#-estados-de-error)
  - [📘 Conclusión](#-conclusión)

---

## 1. Research y Análisis de Usuario

### 👩‍💼 Persona Principal

| Atributo        | Descripción                                               |
| --------------- | --------------------------------------------------------- |
| **Nombre**      | María Rodríguez                                           |
| **Edad**        | 32 años                                                   |
| **Rol**         | Reclutadora Senior                                        |
| **Contexto**    | Gestiona entre 50 y 100 candidatos por semana             |
| **Pain Points** | Formularios lentos, campos innecesarios, sin autoguardado |
| **Objetivos**   | Registrar candidatos rápido sin perder información        |

### 🗺️ User Journey Map

| Etapa     | Motivación              | Acción                         | Emoción           | Oportunidad                                     |
| --------- | ----------------------- | ------------------------------ | ----------------- | ----------------------------------------------- |
| Inicio    | Añadir nuevo candidato  | Hace clic en “Nuevo Candidato” | 😐 Neutra         | Mostrar progreso y propósito claro              |
| Completar | Registrar datos básicos | Llena campos personales        | 🙂 Ligero interés | Validación rápida y fluida                      |
| Subida CV | Adjuntar archivo        | Arrastra o busca CV            | 😅 Tensión leve   | Feedback visual inmediato                       |
| Confirmar | Revisar y guardar       | Clic en “Guardar”              | 😄 Alivio         | Mensaje de éxito + auto-focus al siguiente paso |

---

## 2. Arquitectura de Información

### 2.1 Estructura del Formulario

| Sección                  | Campos                             | Propósito             |
| ------------------------ | ---------------------------------- | --------------------- |
| **Información Personal** | Nombre, Apellido, Email, Teléfono  | Identificación básica |
| **Ubicación**            | País, Ciudad                       | Contexto geográfico   |
| **Formación**            | Nivel educativo, institución       | Validar perfil        |
| **Experiencia**          | Puesto actual, años de experiencia | Evaluar fit laboral   |
| **Documentación**        | Subida de CV                       | Adjuntar evidencia    |

### 2.2 Flujo de Información

- **Decisión:** *Single-page con scroll progresivo*
  **Justificación:** permite revisión global, evita saltos y confusiones.
- **Progreso visual:** barra superior con puntos activos (`●●○○○`)
- **Auto-guardado:** cada 30 segundos en `IndexedDB`.

---

## 3. Wireframes Detallados

### 3.1 Vista Desktop (1920x1080)

```
+--------------------------------------------------------------------------------------+
| [← Volver]        Añadir Nuevo Candidato                           [? Ayuda]        |
|--------------------------------------------------------------------------------------|
| ●●○○○   Paso 1 de 5 – Información Personal                                         |
+--------------------------------------------------------------------------------------+
| 👤 Información Personal                                                             |
|--------------------------------------------------------------------------------------|
| Nombre * [_________________________]  Apellido * [_________________________]        |
| Correo * [__________________________________________] ✓ correo válido               |
| Teléfono * [+__] [_______________________________] 🌍 formato internacional         |
|--------------------------------------------------------------------------------------|
| [Cancelar]                                             [Continuar →]                |
+--------------------------------------------------------------------------------------+
```

#### 📄 Documentación (Subida de CV)

```
┌──────────────────────────────────────────────────────────────┐
│ 📎  Curriculum Vitae                                          │
│--------------------------------------------------------------│
│  [📁 Arrastra tu archivo aquí o haz clic para seleccionar]    │
│  Formatos: PDF, DOCX (máx 5MB)                                │
│                                                              │
│  ✅ cv_juan_perez.pdf (2.3 MB) [✕ Eliminar]                  │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Vista Mobile (375x667)

```
+------------------------------------------------+
| ← Añadir Candidato                             |
| ●●○○○                                          |
|------------------------------------------------|
| Nombre *                                       |
| [_________________________]                    |
| Apellido *                                     |
| [_________________________]                    |
| Email *                                        |
| [_________________________]                    |
| Teléfono * [+__] [_________]                   |
|------------------------------------------------|
| [📎 Subir CV]                                  |
| ✅ cv_perez.pdf (ok)                           |
|------------------------------------------------|
| [Guardar] (Sticky bottom button)               |
+------------------------------------------------+
```

**Adaptaciones:**

- Inputs apilados verticalmente
- Botón “Guardar” fijo en parte inferior
- Campos con padding lateral 16px
- Feedback inmediato con checkmarks ✅

---

## 4. Sistema de Diseño y Componentes

### 4.1 Design Tokens (resumen visual)

| Token         | Valor       | Uso                 |
| ------------- | ----------- | ------------------- |
| Primary       | `#0066CC`   | Botones principales |
| Success       | `#00B050`   | Mensajes positivos  |
| Error         | `#E63946`   | Validación fallida  |
| Neutral-100   | `#F8F9FA`   | Fondo claro         |
| Neutral-900   | `#212529`   | Texto principal     |
| Border Radius | 8px         | Inputs y botones    |
| Font Base     | Inter, 16px | Texto y formularios |

---

### 4.2 Componentes Reutilizables

#### **Input Field**

| Propiedad   | Descripción                    |
| ----------- | ------------------------------ |
| Estados     | default, focus, filled, error  |
| Helper text | Explica formato o restricción  |
| Iconos      | Opcional izquierda/derecha     |
| Animación   | border grow 1px → 2px en 200ms |

**Ejemplo:**

```
[📧] Correo Electrónico *
[___________________________]
✓ correo@ejemplo.com válido
```

#### **Button**

| Variante  | Color        | Uso               |
| --------- | ------------ | ----------------- |
| Primary   | Azul #0066CC | Acción principal  |
| Secondary | Gris #F1F3F5 | Navegación        |
| Ghost     | Transparente | Acciones neutras  |
| Danger    | Rojo #E63946 | Eliminar/Cancelar |

#### **File Upload**

- Drag & Drop visual
- Barra de progreso lineal
- Mensajes dinámicos (éxito/error)
- Previsualización + botón eliminar

---

## 5. Estados e Interacciones

### 5.1 Estados del Formulario

| Estado     | Descripción                         |
| ---------- | ----------------------------------- |
| Empty      | Sin datos ingresados                |
| Filling    | Usuario interactuando               |
| Validating | Validación onBlur                   |
| Error      | Campos con error visible            |
| Submitting | Loading spinner                     |
| Success    | Confirmación visual con confetti 🎉 |

### 5.2 Micro-interacciones

| Evento             | Efecto                                     | Duración |
| ------------------ | ------------------------------------------ | -------- |
| Focus input        | Border azul suave + label flotante         | 200ms    |
| Validación exitosa | Check verde fade-in                        | 300ms    |
| Error              | Shake ligero horizontal                    | 400ms    |
| Subida archivo     | Progreso 0→100% con easing                 | 800ms    |
| Envío exitoso      | Confetti burst + toast “Candidato añadido” | 1.2s     |

---

## 6. Validación Visual

### 6.1 Inline Validation

```
✅ Email válido → checkmark verde
❌ Email inválido → borde rojo + mensaje
```

| Error               | Mensaje                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------- |
| Email inválido      | “Ingresa un correo válido (ejemplo: [usuario@empresa.com](mailto:usuario@empresa.com))” |
| Teléfono incorrecto | “Debe incluir prefijo internacional (+34...)”                                           |
| Archivo grande      | “El archivo supera los 5MB”                                                             |

### 6.2 Acciones Correctivas

- Auto-focus al primer error
- Scroll automático hacia el campo afectado
- Color rojo y vibración (en mobile)

---

## 7. Accesibilidad (WCAG 2.1 Level AA)

| Criterio               | Implementación                         |
| ---------------------- | -------------------------------------- |
| Contraste mínimo       | 4.5:1 en texto normal                  |
| Navegación por teclado | Orden lógico (Tab/Shift+Tab)           |
| Focus visible          | Borde azul 2px                         |
| Aria labels            | `<label for="">` y `aria-describedby`  |
| Live regions           | `aria-live="polite"` para validaciones |
| Iconos alternativos    | `role="img"` + `aria-label`            |

---

## 8. Responsive Design

| Breakpoint  | Layout              | Detalle                        |
| ----------- | ------------------- | ------------------------------ |
| 320–767px   | 1 columna           | Botones sticky, inputs grandes |
| 768–1023px  | 2 columnas          | Sidebar progreso               |
| 1024–1439px | 2 columnas          | Distribución balanceada        |
| 1440px+     | Máx 1200px centrado | Espacios amplios               |

---

## 9. Performance y Carga

| Optimización        | Descripción                  |
| ------------------- | ---------------------------- |
| Lazy Loading        | Carga diferida de secciones  |
| Debounce            | Validaciones con 300ms delay |
| Optimistic UI       | Feedback inmediato           |
| Auto-save           | Draft cada 30s               |
| Bundle Size         | < 100KB gzip                 |
| Time to Interactive | < 2s                         |

---

## 10. Casos de Error y Empty States

### 10.1 Error de Red

```
┌─────────────────────────────────────────────┐
│ ⚠️ ¡Ups! Algo salió mal                     │
│ No pudimos guardar los datos.               │
│ Verifica tu conexión.                       │
│ [🔄 Reintentar] [💾 Guardar Borrador]       │
└─────────────────────────────────────────────┘
```

### 10.2 Resumen de Errores

```
❌ Corrige antes de continuar:
  • El email no es válido
  • El teléfono debe tener prefijo
  • Falta cargar el CV
```

---

## 11. Design Tokens JSON

```json
{
  "colors": {
    "primary": "#0066CC",
    "success": "#00B050",
    "error": "#E63946",
    "neutral100": "#F8F9FA",
    "neutral900": "#212529"
  },
  "font": {
    "family": "Inter",
    "sizes": {
      "h1": "32px",
      "h2": "24px",
      "body": "16px",
      "caption": "14px"
    }
  },
  "spacing": {
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "16px"
  }
}
```

---

## 12. Prototype Flow Description

### 🧭 Paso a Paso

1. **Inicio:** Usuario hace clic en “Añadir Candidato”
   → Se abre formulario con progreso “Paso 1 de 5”.
2. **Completa información personal**
   → Validación inmediata onBlur.
3. **Sube CV**
   → Arrastra archivo, animación de carga → check ✅
4. **Envío del formulario**
   → Botón muestra spinner → toast “Candidato añadido”.
5. **Post-envío:**
   → Auto-focus en botón “Ver Candidato”
   → Confetti animation 🎉

### 🔄 Estados de Error

- Si falla conexión → Modal con reintento
- Si hay duplicado → Popup con opciones (“Ver perfil existente” / “Cancelar”)
- Si timeout API → Notificación persistente con retry

---

## 📘 Conclusión

El diseño **FormulARTE** prioriza una experiencia **fluida, accesible y emocionalmente positiva**.
Transforma un proceso burocrático en una interacción amigable, con microinteracciones que **humanizan la tarea repetitiva** del reclutador.

> “Los buenos formularios no solo recogen datos, también transmiten confianza.” ✨
