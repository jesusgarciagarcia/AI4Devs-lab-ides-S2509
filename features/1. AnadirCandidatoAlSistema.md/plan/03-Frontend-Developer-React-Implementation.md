# ⚛️ Frontend Developer - Implementación React + TypeScript

## 📋 Rol

Eres un **Senior Frontend Engineer** especializado en React y TypeScript con 7+ años de experiencia. Eres experto en arquitectura de componentes, state management, performance optimization y testing. Conoces profundamente hooks, patrones de composición, accessibility y mejores prácticas de React moderna.

## 🚀 Título y Descripción del Proyecto

**Título:** "¡ReactForm Turbo! ⚡ - El Formulario que Hasta Redux Envidiaría"

**Descripción:** Construye un formulario tan elegante y performante que tus componentes se autorefactorizarán del orgullo. ¡Porque el código bonito no es solo un mito, es una religión! 🙏💻

## 🎯 Instrucción Principal

Implementa el formulario completo "Añadir Candidato al Sistema" en React + TypeScript siguiendo las mejores prácticas de la industria. Debes generar:

1. Arquitectura de componentes (atomic design)
2. Código fuente de todos los componentes
3. Custom hooks para lógica reutilizable
4. Validación de formularios (schema-based)
5. Gestión de estado (local state vs context)
6. Manejo de errores y loading states
7. Tests unitarios e integración
8. Documentación técnica

## 🏗️ Estructura Lógica del Documento

### 1. Arquitectura de Componentes

#### 1.1 Árbol de Componentes

```
AddCandidateForm (Container)
├── FormHeader
│   ├── BackButton
│   └── ProgressIndicator
├── FormSections (Wizard)
│   ├── PersonalInfoSection
│   │   ├── TextField (Nombre)
│   │   ├── TextField (Apellido)
│   │   ├── EmailField
│   │   └── PhoneField
│   ├── AddressSection
│   │   └── TextField (Dirección)
│   ├── EducationSection
│   │   └── TextArea (Educación)
│   ├── ExperienceSection
│   │   └── TextArea (Experiencia)
│   └── DocumentSection
│       └── FileUpload (CV)
├── FormActions
│   ├── Button (Cancelar)
│   └── Button (Guardar)
└── ToastNotification (Success/Error)
```

#### 1.2 Principio de Diseño: Atomic Design

- **Atoms:** TextField, Button, Label, ErrorMessage
- **Molecules:** FormField (Label + Input + Error), FileUploadZone
- **Organisms:** PersonalInfoSection, DocumentSection
- **Templates:** FormWizardLayout
- **Pages:** AddCandidatePage

### 2. Stack Tecnológico

#### 2.1 Dependencias Core

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0"
}
```

#### 2.2 Dependencias Adicionales Recomendadas

```json
{
  "react-hook-form": "^7.51.0",     // Gestión de formularios
  "zod": "^3.22.0",                  // Validación de schemas
  "react-dropzone": "^14.2.3",       // File upload
  "clsx": "^2.1.0",                  // Conditional classes
  "react-hot-toast": "^2.4.1"        // Notificaciones
}
```

#### 2.3 Dev Dependencies

```json
{
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.1.5",
  "@testing-library/user-event": "^14.5.1",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "vitest": "^1.2.0"
}
```

### 3. Estructura de Carpetas

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── TextField/
│   │   └── Label/
│   ├── molecules/
│   │   ├── FormField/
│   │   └── FileUploadZone/
│   ├── organisms/
│   │   ├── PersonalInfoSection/
│   │   └── AddCandidateForm/
│   └── templates/
│       └── FormWizardLayout/
├── hooks/
│   ├── useFormValidation.ts
│   ├── useFileUpload.ts
│   └── useFormPersistence.ts
├── types/
│   ├── candidate.types.ts
│   └── form.types.ts
├── schemas/
│   └── candidateSchema.ts
├── services/
│   └── candidateService.ts
├── utils/
│   ├── validators.ts
│   └── formatters.ts
└── constants/
    └── formConfig.ts
```

### 4. Implementación de Componentes

#### 4.1 Types Definition (`types/candidate.types.ts`)

```typescript
export interface Candidate {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvFile?: File | null;
}

export interface CandidateFormData extends Omit<Candidate, 'id'> {
  cvFile: File | null;
}

export type FormStep =
  | 'personal-info'
  | 'address'
  | 'education'
  | 'experience'
  | 'documents';

export interface FormStepConfig {
  id: FormStep;
  title: string;
  description: string;
  fields: string[];
}
```

#### 4.2 Validation Schema (`schemas/candidateSchema.ts`)

```typescript
import { z } from 'zod';

// Email validation según RFC 5322 simplificado
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Teléfono internacional E.164
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const candidateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras'),

  email: z
    .string()
    .email('Ingresa un correo válido')
    .regex(emailRegex, 'Formato de correo inválido')
    .toLowerCase(),

  phone: z
    .string()
    .regex(phoneRegex, 'Formato de teléfono inválido (ejemplo: +34612345678)')
    .min(8, 'El teléfono debe tener al menos 8 dígitos'),

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

  cvFile: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'El archivo no puede superar 5MB')
    .refine(
      (file) => ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
      'Solo se permiten archivos PDF o DOCX'
    )
    .nullable()
});

export type CandidateSchemaType = z.infer<typeof candidateSchema>;
```

#### 4.3 Custom Hook: useFormValidation

```typescript
import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseFormValidationProps<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
}

export function useFormValidation<T>({ schema, onSubmit }: UseFormValidationProps<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    async (fieldName: string, value: unknown): Promise<boolean> => {
      try {
        // Validar solo el campo específico
        await schema.parseAsync({ [fieldName]: value });
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find((e) => e.path[0] === fieldName);
          if (fieldError) {
            setErrors((prev) => ({
              ...prev,
              [fieldName]: fieldError.message,
            }));
          }
        }
        return false;
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    async (data: unknown): Promise<boolean> => {
      try {
        await schema.parseAsync(data);
        setErrors({});
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formattedErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const fieldName = err.path[0] as string;
            formattedErrors[fieldName] = err.message;
          });
          setErrors(formattedErrors);
        }
        return false;
      }
    },
    [schema]
  );

  const handleSubmit = useCallback(
    async (data: unknown) => {
      setIsSubmitting(true);
      try {
        const isValid = await validateForm(data);
        if (isValid) {
          await onSubmit(data as T);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, onSubmit]
  );

  return {
    errors,
    isSubmitting,
    validateField,
    validateForm,
    handleSubmit,
    clearErrors: () => setErrors({}),
  };
}
```

#### 4.4 Custom Hook: useFileUpload

```typescript
import { useState, useCallback } from 'react';

interface UseFileUploadReturn {
  file: File | null;
  uploadProgress: number;
  error: string | null;
  isUploading: boolean;
  handleFileSelect: (file: File) => void;
  handleFileRemove: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    // Validaciones
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (selectedFile.size > maxSize) {
      setError('El archivo supera los 5MB');
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Solo se permiten archivos PDF o DOCX');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Simular progreso de upload (en producción, usar xhr.upload.onprogress)
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 100);
  }, []);

  const handleFileRemove = useCallback(() => {
    setFile(null);
    setUploadProgress(0);
    setError(null);
  }, []);

  return {
    file,
    uploadProgress,
    error,
    isUploading,
    handleFileSelect,
    handleFileRemove,
  };
}
```

#### 4.5 Atom: TextField Component

```typescript
// components/atoms/TextField/TextField.tsx
import React, { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isValid?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isValid,
      className,
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || `textfield-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="textfield-wrapper">
        {label && (
          <label
            htmlFor={inputId}
            className="textfield-label"
          >
            {label}
            {rest.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="textfield-input-wrapper">
          {leftIcon && <div className="textfield-left-icon">{leftIcon}</div>}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'textfield-input',
              {
                'textfield-input--error': error,
                'textfield-input--valid': isValid && !error,
                'textfield-input--with-left-icon': leftIcon,
                'textfield-input--with-right-icon': rightIcon,
              },
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...rest}
          />

          {rightIcon && <div className="textfield-right-icon">{rightIcon}</div>}

          {isValid && !error && (
            <div className="textfield-valid-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M16.667 5L7.5 14.167 3.333 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="textfield-error" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="textfield-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
```

#### 4.6 Organism: AddCandidateForm (Main Container)

```typescript
// components/organisms/AddCandidateForm/AddCandidateForm.tsx
import React, { useState } from 'react';
import { candidateSchema, CandidateSchemaType } from '../../../schemas/candidateSchema';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { PersonalInfoSection } from './PersonalInfoSection';
import { DocumentSection } from './DocumentSection';
import { Button } from '../../atoms/Button';
import toast from 'react-hot-toast';

interface AddCandidateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddCandidateForm: React.FC<AddCandidateFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CandidateSchemaType>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    cvFile: null,
  });

  const {
    errors,
    isSubmitting,
    validateField,
    handleSubmit,
  } = useFormValidation({
    schema: candidateSchema,
    onSubmit: async (data) => {
      try {
        // Aquí iría la llamada al backend
        // await candidateService.createCandidate(data);

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success('¡Candidato añadido exitosamente! 🎉', {
          duration: 4000,
          position: 'top-right',
        });

        onSuccess?.();
      } catch (error) {
        toast.error('Error al guardar el candidato. Por favor, intenta de nuevo.', {
          duration: 4000,
          position: 'top-right',
        });
        throw error;
      }
    },
  });

  const fileUpload = useFileUpload();

  const handleFieldChange = (field: keyof CandidateSchemaType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFieldBlur = async (field: keyof CandidateSchemaType) => {
    await validateField(field, formData[field]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      cvFile: fileUpload.file,
    };

    await handleSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={onSubmit} className="add-candidate-form" noValidate>
      <div className="form-header">
        <h1 className="form-title">Añadir Nuevo Candidato</h1>
        <p className="form-description">
          Completa la información del candidato para añadirlo al sistema
        </p>
      </div>

      <PersonalInfoSection
        formData={formData}
        errors={errors}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
      />

      <DocumentSection
        file={fileUpload.file}
        error={fileUpload.error}
        uploadProgress={fileUpload.uploadProgress}
        isUploading={fileUpload.isUploading}
        onFileSelect={fileUpload.handleFileSelect}
        onFileRemove={fileUpload.handleFileRemove}
      />

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Candidato'}
        </Button>
      </div>
    </form>
  );
};
```

### 5. Testing Strategy

#### 5.1 Unit Tests (TextField.test.tsx)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders label when provided', () => {
    render(<TextField label="Nombre" />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<TextField label="Email" error="Email inválido" />);
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('calls onChange when user types', async () => {
    const handleChange = jest.fn();
    render(<TextField label="Nombre" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Juan');

    expect(handleChange).toHaveBeenCalledTimes(4); // J, u, a, n
  });

  it('shows required indicator when required prop is true', () => {
    render(<TextField label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TextField className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });
});
```

#### 5.2 Integration Tests (AddCandidateForm.test.tsx)

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddCandidateForm } from './AddCandidateForm';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast');

describe('AddCandidateForm', () => {
  it('validates required fields on submit', async () => {
    render(<AddCandidateForm />);

    const submitButton = screen.getByRole('button', { name: /guardar candidato/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<AddCandidateForm />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab(); // Trigger onBlur

    await waitFor(() => {
      expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const onSuccess = jest.fn();
    render(<AddCandidateForm onSuccess={onSuccess} />);

    // Fill all required fields
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan');
    await userEvent.type(screen.getByLabelText(/apellido/i), 'Pérez');
    await userEvent.type(screen.getByLabelText(/correo/i), 'juan@ejemplo.com');
    await userEvent.type(screen.getByLabelText(/teléfono/i), '+34612345678');
    await userEvent.type(screen.getByLabelText(/dirección/i), 'Calle Principal 123');
    await userEvent.type(screen.getByLabelText(/educación/i), 'Universidad XYZ');
    await userEvent.type(screen.getByLabelText(/experiencia/i), '5 años como desarrollador');

    const submitButton = screen.getByRole('button', { name: /guardar candidato/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('exitosamente'),
        expect.any(Object)
      );
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = jest.fn();
    render(<AddCandidateForm onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });
});
```

### 6. Performance Optimization

#### 6.1 Code Splitting

```typescript
// Lazy load el formulario
const AddCandidateForm = lazy(() => import('./components/organisms/AddCandidateForm'));

// En el componente padre
<Suspense fallback={<LoadingSpinner />}>
  <AddCandidateForm />
</Suspense>
```

#### 6.2 Memoization

```typescript
// Memoizar componentes pesados
export const PersonalInfoSection = React.memo(PersonalInfoSectionComponent);

// Memoizar callbacks
const handleFieldChange = useCallback((field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
}, []);
```

#### 6.3 Debounced Validation

```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedValidate = useDebouncedCallback(
  (field, value) => validateField(field, value),
  300
);
```

### 7. Accessibility Checklist

- [ ] Todos los inputs tienen labels asociados
- [ ] Uso de aria-invalid en campos con error
- [ ] Uso de aria-describedby para mensajes de error
- [ ] Navegación por teclado funcional (Tab, Enter, Escape)
- [ ] Focus visible en todos los elementos interactivos
- [ ] Mensajes de error con role="alert" para screen readers
- [ ] Contraste de colores AAA (4.5:1 mínimo)
- [ ] Soporte para prefers-reduced-motion
- [ ] Formulario funcional sin JavaScript (progressive enhancement)

## 🎨 Claridad y Precisión

**Especificaciones Exactas:**

1. **Validación:** Usar Zod para schemas type-safe
2. **State Management:** React Hook Form o useState + custom hooks
3. **Estilos:** CSS Modules o Tailwind CSS
4. **File Upload:** React Dropzone o custom implementation
5. **Notifications:** React Hot Toast
6. **Testing:** Testing Library + Vitest/Jest

## 🌍 Contexto Adecuado

**Proyecto Context:**

- React 18.2+ (usando concurrent features)
- TypeScript 5.0+ (strict mode enabled)
- Vite como bundler
- ESLint + Prettier configurados
- Husky para pre-commit hooks

**Browser Support:**

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📤 Formato de Salida

**Entregables:**

1. **Código fuente completo** de todos los componentes
2. **Tests unitarios e integración** con >80% coverage
3. **Documentación técnica** en Markdown
4. **Storybook stories** (opcional pero recomendado)
5. **README** con instrucciones de setup

## 🎭 Tono, Estilo y Longitud

**Tono:** Técnico, preciso, orientado a best practices

**Estilo:**

- Código con comentarios JSDoc
- Type-safe (aprovechar TypeScript)
- Componentes pequeños y componibles
- Naming conventions claras

**Longitud:**

- Documento principal: 3000-5000 palabras
- Incluir código completo, no snippets incompletos

## ✅ Criterios Técnicos Obligatorios

**Technical Criteria:**

- **SOLID Principles:**
  - Single Responsibility: Un componente, una responsabilidad
  - Open/Closed: Extendible mediante props
  - Liskov Substitution: Interfaces consistentes
  - Interface Segregation: Props específicas por componente
  - Dependency Inversion: Inyectar dependencias mediante props

- **Clean Code:**
  - Nombres descriptivos (no abreviaturas)
  - Funciones pequeñas (<50 líneas)
  - DRY (Don't Repeat Yourself)
  - KISS (Keep It Simple, Stupid)

- **Responsive Design:**
  - Mobile-first approach
  - Breakpoints: 640px, 768px, 1024px, 1280px
  - Touch-friendly (44x44px minimum)

**General Criteria:**

- Attractive title ✅
- Componentización extrema
- Performance-focused
- Accessibility-first

## 🚀 Acción Requerida

Genera el código completo de implementación del formulario siguiendo:

1. **Estructura modular:** Atomic design
2. **Type safety:** Todo tipado con TypeScript
3. **Validación robusta:** Zod schemas
4. **Testing completo:** Unit + Integration
5. **Documentación clara:** JSDoc + README

**Prioriza:** Type safety, reusabilidad y mantenibilidad.

**Entrega:** Código production-ready con tests.
