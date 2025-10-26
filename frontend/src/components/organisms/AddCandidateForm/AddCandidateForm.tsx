/**
 * AddCandidateForm - Main form organism
 * Orchestrates all form sections and validation
 */

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { candidateSchema, CandidateSchemaType } from '../../../schemas/candidateSchema';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { createCandidate } from '../../../services/candidateService';
import { TextField } from '../../atoms/TextField';
import { TextArea } from '../../atoms/TextArea';
import { Button } from '../../atoms/Button';
import { FileUploadZone } from '../../molecules/FileUploadZone';
import './AddCandidateForm.css';

/**
 * AddCandidateForm props
 */
export interface AddCandidateFormProps {
    onSuccess?: (data: CandidateSchemaType) => void;
    onCancel?: () => void;
}

/**
 * Main form component for adding candidates
 * Implements full validation, error handling, and success states
 *
 * @example
 * <AddCandidateForm
 *   onSuccess={(data) => console.log('Candidate added:', data)}
 *   onCancel={() => navigate('/candidates')}
 * />
 */
export const AddCandidateForm: React.FC<AddCandidateFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    // Form state
    const [formData, setFormData] = useState<Omit<CandidateSchemaType, 'cvFile'>>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        education: '',
        experience: '',
    });

    // Validation hook
    const {
        errors,
        isSubmitting,
        validateField,
        handleSubmit,
    } = useFormValidation({
        schema: candidateSchema,
        onSubmit: async (data) => {
            try {
                // Call the real API
                const candidateData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    education: formData.education,
                    workExperience: formData.experience,
                    cv: fileUpload.file || undefined,
                };

                await createCandidate(candidateData);

                toast.success('¡Candidato añadido exitosamente! 🎉', {
                    duration: 4000,
                    position: 'top-right',
                    icon: '✅',
                });

                onSuccess?.(data as CandidateSchemaType);

                // Reset form
                resetForm();
            } catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Error al guardar el candidato. Por favor, intenta de nuevo.';

                toast.error(errorMessage, {
                    duration: 4000,
                    position: 'top-right',
                    icon: '❌',
                });
                throw error;
            }
        },
    });

    // File upload hook
    const fileUpload = useFileUpload();

    /**
     * Handle field change
     */
    const handleFieldChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    /**
     * Handle field blur (trigger validation)
     */
    const handleFieldBlur = async (field: keyof typeof formData) => {
        await validateField(field, formData[field]);
    };

    /**
     * Handle form submission
     */
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            cvFile: fileUpload.file,
        };

        await handleSubmit(dataToSubmit);
    };

    /**
     * Reset form to initial state
     */
    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            education: '',
            experience: '',
        });
        fileUpload.resetUpload();
    };

    /**
     * Handle cancel action
     */
    const handleCancel = () => {
        if (Object.values(formData).some(value => value !== '') || fileUpload.file) {
            const confirmed = window.confirm(
                '¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.'
            );
            if (!confirmed) return;
        }
        onCancel?.();
    };

    return (
        <>
            <Toaster />
            <form onSubmit={onSubmit} className="add-candidate-form" noValidate>
                {/* Form Header */}
                <div className="form-header">
                    <h1 className="form-title">Añadir Nuevo Candidato</h1>
                    <p className="form-description">
                        Completa la información del candidato para añadirlo al sistema de reclutamiento
                    </p>
                </div>

                {/* Personal Information Section */}
                <section className="form-section">
                    <h2 className="form-section-title">
                        <span className="form-section-icon">👤</span>
                        Información Personal
                    </h2>

                    <div className="form-grid form-grid--2-cols">
                        <TextField
                            label="Nombre"
                            name="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleFieldChange('firstName', e.target.value)}
                            onBlur={() => handleFieldBlur('firstName')}
                            error={errors.firstName}
                            isValid={!errors.firstName && formData.firstName.length >= 2}
                            required
                            placeholder="Juan"
                            autoComplete="given-name"
                        />

                        <TextField
                            label="Apellido"
                            name="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleFieldChange('lastName', e.target.value)}
                            onBlur={() => handleFieldBlur('lastName')}
                            error={errors.lastName}
                            isValid={!errors.lastName && formData.lastName.length >= 2}
                            required
                            placeholder="Pérez"
                            autoComplete="family-name"
                        />
                    </div>

                    <div className="form-grid form-grid--2-cols">
                        <TextField
                            label="Correo Electrónico"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            onBlur={() => handleFieldBlur('email')}
                            error={errors.email}
                            isValid={!errors.email && formData.email.includes('@')}
                            required
                            placeholder="juan.perez@ejemplo.com"
                            autoComplete="email"
                        />

                        <TextField
                            label="Teléfono"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            onBlur={() => handleFieldBlur('phone')}
                            error={errors.phone}
                            isValid={!errors.phone && formData.phone.length >= 8}
                            required
                            placeholder="+34612345678"
                            autoComplete="tel"
                            helperText="Formato internacional (ejemplo: +34612345678)"
                        />
                    </div>
                </section>

                {/* Address Section */}
                <section className="form-section">
                    <h2 className="form-section-title">
                        <span className="form-section-icon">📍</span>
                        Ubicación
                    </h2>

                    <TextField
                        label="Dirección"
                        name="address"
                        value={formData.address}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        onBlur={() => handleFieldBlur('address')}
                        error={errors.address}
                        isValid={!errors.address && formData.address.length >= 10}
                        required
                        placeholder="Calle Principal, 123, Madrid, España"
                        autoComplete="street-address"
                    />
                </section>

                {/* Education Section */}
                <section className="form-section">
                    <h2 className="form-section-title">
                        <span className="form-section-icon">📚</span>
                        Formación Académica
                    </h2>

                    <TextArea
                        label="Educación"
                        name="education"
                        value={formData.education}
                        onChange={(e) => handleFieldChange('education', e.target.value)}
                        onBlur={() => handleFieldBlur('education')}
                        error={errors.education}
                        isValid={!errors.education && formData.education.length >= 10}
                        required
                        placeholder="Licenciatura en Ingeniería Informática - Universidad de Madrid (2015-2019)"
                        rows={4}
                        maxLength={1000}
                        showCharacterCount
                    />
                </section>

                {/* Experience Section */}
                <section className="form-section">
                    <h2 className="form-section-title">
                        <span className="form-section-icon">💼</span>
                        Experiencia Profesional
                    </h2>

                    <TextArea
                        label="Experiencia Laboral"
                        name="experience"
                        value={formData.experience}
                        onChange={(e) => handleFieldChange('experience', e.target.value)}
                        onBlur={() => handleFieldBlur('experience')}
                        error={errors.experience}
                        isValid={!errors.experience && formData.experience.length >= 10}
                        required
                        placeholder="Desarrollador Full Stack en Tech Company (2019-2024) - Desarrollo de aplicaciones web con React y Node.js..."
                        rows={6}
                        maxLength={2000}
                        showCharacterCount
                    />
                </section>

                {/* Documents Section */}
                <section className="form-section">
                    <h2 className="form-section-title">
                        <span className="form-section-icon">📄</span>
                        Documentación
                    </h2>

                    <FileUploadZone
                        file={fileUpload.file}
                        error={fileUpload.error || errors.cvFile}
                        uploadProgress={fileUpload.uploadProgress}
                        isUploading={fileUpload.isUploading}
                        onFileSelect={fileUpload.handleFileSelect}
                        onFileRemove={fileUpload.handleFileRemove}
                        disabled={isSubmitting}
                    />
                </section>

                {/* Form Actions */}
                <div className="form-actions">
                    <Button
                        type="button"
                        variant="secondary"
                        size="large"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Candidato'}
                    </Button>
                </div>
            </form>
        </>
    );
};
