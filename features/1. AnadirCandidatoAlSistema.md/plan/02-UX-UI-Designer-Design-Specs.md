# 🎨 UX/UI Designer - Diseño de Interfaz y Experiencia de Usuario

## 📋 Rol

Eres un **UX/UI Designer Senior** con especialización en diseño de formularios complejos y sistemas empresariales. Tienes 8+ años de experiencia en diseño de productos B2B, con expertise en accesibilidad (WCAG 2.1), diseño atómico y sistemas de diseño escalables.

## 🌈 Título y Descripción del Proyecto

**Título:** "¡FormulARTE! 🎨 - El Formulario que No Da Pereza Llenar"

**Descripción:** Transforma la temida experiencia de "otro formulario más" en un viaje visual placentero que incluso hará sonreír a tu reclutador más gruñón. ¡Porque los formularios no tienen que parecer declaraciones de impuestos! 📝✨

## 🎯 Instrucción Principal

Diseña la experiencia de usuario completa para el formulario "Añadir Candidato al Sistema", incluyendo:

1. Arquitectura de información del formulario
2. Wireframes detallados (descripciones textuales precisas)
3. Flujos de usuario (happy path y error states)
4. Sistema de componentes reutilizables
5. Guía de micro-interacciones y animaciones
6. Especificaciones de accesibilidad
7. Diseño responsive (mobile, tablet, desktop)

## 🏗️ Estructura Lógica del Documento

### 1. Research y Análisis de Usuario

#### 1.1 Persona Principal

- **Nombre:** María Rodríguez, Reclutadora Senior
- **Edad:** 32 años
- **Contexto:** Gestiona 50-100 candidatos por semana
- **Pain points:** Formularios lentos, campos innecesarios, falta de autoguardado
- **Objetivos:** Registrar candidatos rápidamente sin perder información

#### 1.2 User Journey Map

Describe el viaje completo desde que el usuario decide añadir un candidato hasta la confirmación final:

- Punto de entrada
- Motivación
- Acciones
- Emociones en cada paso
- Oportunidades de mejora

### 2. Arquitectura de Información

#### 2.1 Estructura del Formulario

Organización de campos en secciones lógicas:

- **Sección 1:** Información Personal (Nombre, Apellido, Email, Teléfono)
- **Sección 2:** Ubicación (Dirección)
- **Sección 3:** Formación (Educación)
- **Sección 4:** Experiencia Profesional (Experiencia laboral)
- **Sección 5:** Documentación (Upload CV)

#### 2.2 Flujo de Información

- ¿Secuencial o todo visible?
- ¿Wizards multi-paso o single page?
- Justificación de la decisión

### 3. Wireframes Detallados (Descripción Textual)

#### 3.1 Vista Desktop (1920x1080)

**Header del Formulario:**

```
+----------------------------------------------------------+
|  [← Volver]              Añadir Nuevo Candidato    [?]   |
|  Barra de progreso: ●●○○○ (Paso 1 de 5)                  |
+----------------------------------------------------------+
```

**Sección: Información Personal**

```
┌─────────────────────────────────────────────────────────┐
│ 👤 Información Personal                                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Nombre *                          Apellido *            │
│  [_____________________]          [____________________] │
│                                                          │
│  Correo Electrónico *                                    │
│  [______________________________________________]        │
│  ✓ correo@ejemplo.com es válido                         │
│                                                          │
│  Teléfono *                                              │
│  [+__] [___________________________________________]     │
│  🌍 Formato internacional                                │
│                                                          │
│                     [Continuar →]                        │
└─────────────────────────────────────────────────────────┘
```

**Sección: Carga de CV**

```
┌─────────────────────────────────────────────────────────┐
│ 📄 Documentación                                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Curriculum Vitae                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  📎  Arrastra tu archivo aquí                    │   │
│  │      o haz clic para seleccionar                 │   │
│  │                                                  │   │
│  │      Formatos: PDF, DOCX (Max 5MB)              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ✅ cv_juan_perez.pdf (2.3 MB) [✕]                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### 3.2 Vista Mobile (375x667)

Descripción de cómo se adapta el formulario:

- Campos apilados verticalmente
- Botones de acción sticky en la parte inferior
- Teclados optimizados (numérico para teléfono, email para correo)
- Gestos de swipe entre secciones

### 4. Sistema de Diseño y Componentes

#### 4.1 Design Tokens

```
Colores:
  Primary: #0066CC (Azul confianza)
  Success: #00B050 (Verde confirmación)
  Error: #E63946 (Rojo error)
  Warning: #F59E0B (Amarillo advertencia)
  Neutral-100: #F8F9FA (Fondo claro)
  Neutral-900: #212529 (Texto principal)

Typography:
  Heading-1: 32px, Weight 700, Line-height 40px
  Heading-2: 24px, Weight 600, Line-height 32px
  Body: 16px, Weight 400, Line-height 24px
  Caption: 14px, Weight 400, Line-height 20px

Spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px

Border Radius:
  sm: 4px
  md: 8px
  lg: 16px
```

#### 4.2 Componentes Reutilizables

**Input Field Component:**

- Estados: default, focus, filled, error, disabled
- Iconografía: left icon, right icon, clear button
- Helper text y error message
- Character counter para campos con límite

**Button Component:**

- Variantes: primary, secondary, ghost, danger
- Tamaños: small (32px), medium (40px), large (48px)
- Estados: default, hover, active, disabled, loading

**File Upload Component:**

- Drag & drop zone
- Browse button fallback
- Progress indicator
- Preview thumbnail
- Delete action

### 5. Estados e Interacciones

#### 5.1 Estados del Formulario

1. **Empty State:** Primera carga, todos los campos vacíos
2. **Filling State:** Usuario completando información
3. **Validating State:** Sistema validando en tiempo real
4. **Error State:** Errores de validación visibles
5. **Submitting State:** Enviando datos (loading indicator)
6. **Success State:** Confirmación de registro exitoso
7. **Error State (Submit):** Fallo en el envío

#### 5.2 Micro-interacciones

**Al hacer focus en un campo:**

- Animación: Border de 1px a 2px, color neutral a primary
- Duración: 200ms ease-in-out
- Label flota hacia arriba (si floating label)

**Validación en tiempo real:**

- Trigger: onBlur (no mientras escribe, para no frustrar)
- Success: Checkmark verde suave (fade-in 300ms)
- Error: Shake animation + mensaje (shake: 400ms)

**Upload de archivo:**

- Drag over: Background change, border dash animation
- Upload progress: Linear progress bar 0-100%
- Success: Fade in de preview + checkmark

**Envío del formulario:**

- Button cambia a loading state (spinner)
- Formulario bloqueado (disabled overlay)
- Success: Confetti animation + modal de confirmación
- Error: Modal de error con opción de reintentar

### 6. Validación Visual

#### 6.1 Inline Validation

- **Timing:** Validar al perder el foco (onBlur), no mientras escribe
- **Success feedback:** Checkmark verde discreto
- **Error feedback:**
  - Border rojo
  - Icono de error
  - Mensaje específico (no "campo inválido")
  - Ejemplo: "El email debe incluir @ y un dominio válido"

#### 6.2 Mensajes de Error Específicos

```
Email inválido:
❌ "Ingresa un correo válido (ejemplo: usuario@empresa.com)"

Campo vacío:
❌ "Este campo es obligatorio"

Archivo muy grande:
❌ "El archivo supera los 5MB. Intenta con uno más pequeño."

Formato de archivo incorrecto:
❌ "Solo se permiten archivos PDF o DOCX"
```

### 7. Accesibilidad (WCAG 2.1 Level AA)

#### 7.1 Contraste

- Ratio mínimo texto/fondo: 4.5:1 (texto normal)
- Ratio mínimo texto/fondo: 3:1 (texto grande)
- Verificar con herramientas: Contrast Checker

#### 7.2 Navegación por Teclado

- Tab order lógico (top to bottom, left to right)
- Focus visible en todos los elementos interactivos
- Escape para cerrar modals
- Enter para submit

#### 7.3 Screen Readers

- Labels asociados con aria-label o <label for="">
- Mensajes de error con aria-describedby
- Estados de formulario con aria-live regions
- Instrucciones con aria-instructions

#### 7.4 Indicadores No Visuales

- No depender solo del color (agregar iconos)
- Mensajes de error con texto, no solo color rojo
- Estados de loading con aria-busy="true"

### 8. Responsive Design

#### 8.1 Breakpoints

```
Mobile:   320px - 767px  (1 columna)
Tablet:   768px - 1023px (2 columnas)
Desktop:  1024px - 1439px (2-3 columnas)
Large:    1440px+ (max-width: 1200px centrado)
```

#### 8.2 Adaptaciones por Dispositivo

**Mobile:**

- Formulario en una sola columna
- Inputs de altura 48px (thumb-friendly)
- Botones sticky en la parte inferior
- Teclados contextuales (numeric, email, tel)

**Tablet:**

- Campos en 2 columnas cuando sea lógico (Nombre | Apellido)
- Sidebar con progreso del formulario
- Touch targets de 44x44px mínimo

**Desktop:**

- Layout de 2 columnas para optimizar espacio
- Tooltips informativos con hover
- Shortcuts de teclado visibles

Perfecto 👌 A continuación te presento los **wireframes detallados para la vista Tablet (768–1023px)** del formulario **“Añadir Candidato al Sistema”**, siguiendo el mismo sistema de diseño descrito en el documento UX/UI previo.

Estos wireframes están representados en **ASCII art**, son completamente textuales y listos para documentación o handoff de diseño.
El objetivo es reflejar cómo se organiza la interfaz en **2 columnas principales**, optimizando espacio y legibilidad táctil 🧠💡

---

#### 8.3 📱 **Wireframes – Vista Tablet (768–1023px)**

---

##### 🧩 **Vista General del Layout**

```
+--------------------------------------------------------------------------------+
| [←] Añadir Nuevo Candidato                              [? Ayuda]              |
|--------------------------------------------------------------------------------|
| ●●○○○   Paso 1 de 5 – Información Personal                                     |
|--------------------------------------------------------------------------------|
| ┌──────────────────────────────┐  ┌──────────────────────────────┐             |
| | 👤 Información Personal      |  | 📍 Ubicación                  |             |
| |------------------------------|  |------------------------------|             |
| | Nombre *                     |  | País *                       |             |
| | [_____________________]      |  | [_____________]              |             |
| | Apellido *                   |  | Ciudad *                     |             |
| | [_____________________]      |  | [_____________]              |             |
| | Email *                      |  |                              |             |
| | [__________________________] |  |                              |             |
| | Teléfono * [+__] [________]  |  |                              |             |
| └──────────────────────────────┘  └──────────────────────────────┘             |
|--------------------------------------------------------------------------------|
| 📚 Formación y Experiencia                                                     |
|--------------------------------------------------------------------------------|
| Nivel educativo * [_________________]   Puesto actual * [_________________]    |
| Años de experiencia [__]  Institución [___________________________]           |
|--------------------------------------------------------------------------------|
| 📄 Documentación                                                              |
|--------------------------------------------------------------------------------|
| ┌──────────────────────────────────────────────────────────────┐              |
| │ Arrastra tu CV o haz clic para subirlo                       │              |
| │ Formatos: PDF, DOCX (max 5MB)                                │              |
| │ ✅ cv_juan_perez.pdf (2.3 MB) [✕]                            │              |
| └──────────────────────────────────────────────────────────────┘              |
|--------------------------------------------------------------------------------|
| [Cancelar]                                         [Continuar →]              |
+--------------------------------------------------------------------------------+
```

---

##### 🪄 **Interacción Principal**

| Elemento                        | Descripción UX                                    | Interacción                                |
| ------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| **Barra superior fija**         | Contiene navegación y progreso visual             | Scroll down mantiene visible la barra      |
| **Formulario 2 columnas**       | Mejora el escaneo visual                          | Se colapsa a 1 columna en portrait         |
| **Botones inferiores**          | Sticky footer en portrait, flotantes en landscape | “Continuar →” siempre visible              |
| **Inputs agrupados**            | Campos semánticamente relacionados                | Transición suave entre secciones           |
| **Sidebar (progreso opcional)** | En landscape: muestra los pasos activos           | Tappable steps deshabilitados (solo vista) |

---

##### 💻 **Landscape Orientation (1024px ancho)**

```
+--------------------------------------------------------------------------------+
| [←] Añadir Nuevo Candidato                              [? Ayuda]              |
|--------------------------------------------------------------------------------|
| ●●○○○ Paso 1 de 5                                                        ▼     |
|--------------------------------------------------------------------------------|
| Sidebar:                                                                     |
| [● Información Personal]                                                    |
| [○ Ubicación]                                                               |
| [○ Formación y Experiencia]                                                 |
| [○ Documentación]                                                           |
| [○ Confirmar]                                                               |
|--------------------------------------------------------------------------------|
| ┌──────────────────────────────┐  ┌──────────────────────────────┐             |
| | 👤 Información Personal      |  | 📍 Ubicación                  |             |
| |------------------------------|  |------------------------------|             |
| | Nombre *                     |  | País *                       |             |
| | [_____________________]      |  | [_____________]              |             |
| | Apellido *                   |  | Ciudad *                     |             |
| | [_____________________]      |  | [_____________]              |             |
| | Email *                      |  |                              |             |
| | [__________________________] |  |                              |             |
| | Teléfono * [+__] [________]  |  |                              |             |
| └──────────────────────────────┘  └──────────────────────────────┘             |
|--------------------------------------------------------------------------------|
| [📄 Subir CV]   ✅ cv_juan_perez.pdf (2.3 MB) [✕]                              |
|--------------------------------------------------------------------------------|
| [Cancelar]                                         [Guardar y Continuar →]    |
+--------------------------------------------------------------------------------+
```

---

##### 🎛️ **Detalles de Diseño Específicos para Tablet**

| Aspecto                    | Especificación                       | Notas                         |
| -------------------------- | ------------------------------------ | ----------------------------- |
| **Padding lateral**        | 24px                                 | En ambos lados del formulario |
| **Columnas**               | 2 (50% - 50%)                        | Se colapsan a 1 en portrait   |
| **Altura mínima de input** | 44px                                 | Touch-friendly                |
| **Botones**                | 48px de alto, texto en mayúsculas    |                               |
| **Espaciado entre grupos** | 16px vertical                        |                               |
| **Tipografía base**        | Inter 16px / line-height 24px        |                               |
| **Scroll y focus**         | Auto-scroll hacia el siguiente campo |                               |

---

##### 🧠 **Flujo Interactivo (Tablet)**

| Paso | Acción del Usuario            | Feedback Visual                              | Estado       |
| ---- | ----------------------------- | -------------------------------------------- | ------------ |
| 1    | Hace tap en “Nuevo Candidato” | Abre vista con progreso ●○○○○                | `empty`      |
| 2    | Completa datos personales     | Check verde a la derecha del campo           | `filling`    |
| 3    | Cambia a “Ubicación”          | Scroll suave a sección siguiente             | `filling`    |
| 4    | Sube CV                       | Progress bar + animación “subiendo archivo…” | `uploading`  |
| 5    | Clic en “Continuar”           | Loading spinner + transición suave           | `submitting` |
| 6    | Confirmación                  | Confetti + mensaje “Candidato añadido 🎉”    | `success`    |

---

##### ⚙️ **Microinteracciones Tablet**

| Evento                 | Animación                                          | Duración |
| ---------------------- | -------------------------------------------------- | -------- |
| Tap en input           | Border azul (ease-in-out)                          | 200ms    |
| Validación exitosa     | Check verde fade-in                                | 300ms    |
| Error                  | Shake horizontal leve                              | 400ms    |
| Scroll entre secciones | Smooth scroll easing cubic-bezier(.45,.05,.55,.95) | 500ms    |
| Subida de archivo      | Barra lineal progresiva                            | 800ms    |

---

##### ♿ **Accesibilidad Específica Tablet**

- **Focus visible:** sombreado azul y transición suave
- **Labels legibles:** mínimo 16px
- **Touch targets:** mínimo 44x44px
- **Modal (error o confirmación):** centrado y con `aria-modal="true"`
- **Swipe Navigation (opcional):** deslizar lateral para avanzar o retroceder paso

---

##### 🧩 **Resumen Visual Simplificado**

```
[Header fijo]
 ├── Breadcrumb + título
 ├── Progreso (●●○○○)
 ├── Botón Ayuda [?]

[Body]
 ├── Columna Izquierda
 │    ├── Información Personal
 │    ├── Formación
 │
 └── Columna Derecha
      ├── Ubicación
      ├── Documentación

[Footer sticky]
 ├── [Cancelar]
 └── [Continuar →]
```

---

##### 🖌️ **Notas para Implementación (Frontend React + Tailwind)**

| Componente     | Tailwind Classes Sugeridas                                           |
| -------------- | -------------------------------------------------------------------- |
| Form Wrapper   | `grid grid-cols-2 gap-6 md:gap-8 px-6`                               |
| Input          | `w-full h-11 border rounded-md focus:ring-2 focus:ring-blue-500`     |
| Button Primary | `bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-3`      |
| Upload Zone    | `border-2 border-dashed rounded-lg p-6 text-center hover:bg-blue-50` |
| Progress Bar   | `h-2 bg-blue-500 transition-all`                                     |
| Footer         | `sticky bottom-0 bg-white p-4 border-t flex justify-end gap-4`       |

---

¿Quieres que ahora te genere **las versiones visuales en formato imagen (mockups renderizados)** a partir de estos wireframes de tablet (por ejemplo, en estilo “low-fidelity” o “medium-fidelity”)?
Puedo generarlos automáticamente en base a esta estructura textual.

### 9. Performance y Carga

#### 9.1 Lazy Loading

- Cargar secciones del formulario progresivamente
- Imágenes de preview de CV lazy-loaded
- Autocompletado con debounce de 300ms

#### 9.2 Optimistic UI

- Feedback inmediato en interacciones
- Auto-save cada 30 segundos (indicador visual)
- Restaurar desde draft si el usuario abandona

### 10. Casos de Error y Empty States

#### 10.1 Network Error

```
┌─────────────────────────────────────┐
│  ⚠️  ¡Ups! Algo salió mal            │
│                                     │
│  No pudimos guardar los datos.      │
│  Por favor, revisa tu conexión.     │
│                                     │
│  [🔄 Reintentar]  [💾 Guardar Borrador] │
└─────────────────────────────────────┘
```

#### 10.2 Validation Error Summary

```
❌ Revisa estos campos antes de continuar:
  • El email no es válido
  • El teléfono debe tener 10 dígitos
  • Falta cargar el CV
```

## 🎨 Claridad y Precisión

**Especificaciones Exactas:**

1. **Tamaños de Campo:**
   - Input fields: 100% width, 48px height (mobile), 40px height (desktop)
   - Buttons: 48px height minimum (thumb-friendly)
   - Touch targets: 44x44px minimum

2. **Animaciones:**
   - Duración estándar: 200-300ms
   - Easing: ease-in-out para la mayoría
   - Disable animations si prefers-reduced-motion

3. **Iconografía:**
   - Tamaño estándar: 24x24px
   - Estilo: outline (no filled) para consistencia
   - Librería sugerida: Heroicons, Material Icons

4. **Formulario:**
   - Max-width del formulario: 800px (desktop)
   - Padding lateral: 24px (desktop), 16px (mobile)
   - Espaciado entre campos: 16px vertical

## 🌍 Contexto Adecuado

**Contexto del Proyecto:**

- Stack: React + TypeScript
- Sistema de diseño: A definir (recomendación: Tailwind CSS + Headless UI)
- Usuarios: Reclutadores, uso diario intensivo
- Dispositivos: 60% desktop, 30% mobile, 10% tablet
- Entorno: Oficina y remoto

**Restricciones Técnicas:**

- Compatibilidad: Últimas 2 versiones de Chrome, Firefox, Safari, Edge
- Tamaño máximo de bundle del formulario: <100KB
- Tiempo de carga inicial: <2 segundos

## 📤 Formato de Salida

**Entregables:**

1. **Documento de Diseño Completo** en Markdown:
   - Wireframes descritos textualmente con ASCII art
   - Tablas de especificaciones
   - Listas de componentes

2. **Design System Specification:**
   - Tokens en formato JSON o YAML
   - Componentes con props y variantes
   - Guía de uso

3. **Prototype Flow Description:**
   - Descripción paso a paso de la interacción
   - Estados y transiciones
   - Casos de error

## 🎭 Tono, Estilo y Longitud

**Tono:** Creativo pero estructurado, visual y detallado

**Estilo:**

- Usa ASCII art para wireframes cuando sea posible
- Incluye bloques de código para especificaciones técnicas
- Tablas para comparaciones y especificaciones
- Emojis para mejorar la escaneabilidad

**Longitud:**

- Documento principal: 2500-4000 palabras
- Cada sección debe tener ejemplos visuales (texto) o diagramas
- Prioriza la claridad visual sobre la brevedad

## ✅ Criterios Técnicos

**Technical Criteria:**

- Apply the SOLID principles (en la estructuración de componentes)
- Apply clean code principles (nomenclatura consistente)
- Make it a responsive website (mobile-first approach)

**General Criteria:**

- Attractive and funny title and description ✅
- User-centered design approach
- Accessibility-first mindset
- Performance-conscious design decisions

## 🚀 Acción Requerida

**Tu tarea específica es:**

Genera el documento completo de diseño UX/UI siguiendo la estructura descrita, asegurando que:

1. **Cada wireframe sea comprensible** sin necesidad de un diseño visual
2. **Las especificaciones sean implementables** directamente por desarrolladores
3. **El diseño sea accesible** según WCAG 2.1 Level AA
4. **La experiencia sea fluida** y minimice la fricción del usuario
5. **Los estados de error sean claros** y guíen al usuario a la solución

**Prioriza:** Usabilidad, accesibilidad y consistencia visual.

**Entrega:** Documento en Markdown listo para handoff a desarrollo.
