/**
 * FileUploadZone component - Molecule level
 * Drag-and-drop file upload with preview and progress
 */

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../../../schemas/candidateSchema';
import { formatFileSize } from '../../../hooks/useFileUpload';
import './FileUploadZone.css';

/**
 * FileUploadZone component props
 */
export interface FileUploadZoneProps {
    file: File | null;
    error?: string | null;
    uploadProgress?: number;
    isUploading?: boolean;
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    disabled?: boolean;
}

/**
 * FileUploadZone component
 * Drag-and-drop zone for file uploads with validation
 *
 * @example
 * <FileUploadZone
 *   file={file}
 *   error={error}
 *   onFileSelect={handleFileSelect}
 *   onFileRemove={handleFileRemove}
 * />
 */
export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
    file,
    error,
    uploadProgress = 0,
    isUploading = false,
    onFileSelect,
    onFileRemove,
    disabled = false,
}) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ALLOWED_FILE_TYPES,
        maxSize: MAX_FILE_SIZE,
        multiple: false,
        disabled: disabled || isUploading,
    });

    return (
        <div className="file-upload-zone-wrapper">
            <label className="file-upload-zone-label">
                Curriculum Vitae
                <span className="file-upload-zone-required" aria-label="obligatorio">*</span>
            </label>

            {!file ? (
                <div
                    {...getRootProps()}
                    className={clsx('file-upload-zone', {
                        'file-upload-zone--active': isDragActive,
                        'file-upload-zone--error': error,
                        'file-upload-zone--disabled': disabled,
                    })}
                >
                    <input {...getInputProps()} aria-label="Seleccionar archivo CV" />

                    <div className="file-upload-zone-content">
                        <div className="file-upload-zone-icon">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M40 30v6a4 4 0 01-4 4H12a4 4 0 01-4-4v-6M32 18l-8-8m0 0l-8 8m8-8v24"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <div className="file-upload-zone-text">
                            <p className="file-upload-zone-primary-text">
                                {isDragActive ? (
                                    <strong>Suelta el archivo aquí</strong>
                                ) : (
                                    <>
                                        <strong>Arrastra tu archivo aquí</strong> o haz clic para seleccionar
                                    </>
                                )}
                            </p>
                            <p className="file-upload-zone-secondary-text">
                                Formatos: PDF, DOCX (Máximo {formatFileSize(MAX_FILE_SIZE)})
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="file-upload-preview">
                    <div className="file-upload-preview-content">
                        <div className="file-upload-preview-icon">
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22 6H10a4 4 0 00-4 4v20a4 4 0 004 4h20a4 4 0 004-4V18m-12-12l12 12m-12-12v12h12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <div className="file-upload-preview-info">
                            <p className="file-upload-preview-name">{file.name}</p>
                            <p className="file-upload-preview-size">{formatFileSize(file.size)}</p>

                            {isUploading && (
                                <div className="file-upload-progress">
                                    <div
                                        className="file-upload-progress-bar"
                                        style={{ width: `${uploadProgress}%` }}
                                        role="progressbar"
                                        aria-valuenow={uploadProgress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    />
                                </div>
                            )}
                        </div>

                        {!isUploading && (
                            <button
                                type="button"
                                className="file-upload-preview-remove"
                                onClick={onFileRemove}
                                aria-label="Eliminar archivo"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15 5L5 15M5 5l10 10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>

                    {isUploading && (
                        <p className="file-upload-uploading-text">Subiendo archivo...</p>
                    )}
                </div>
            )}

            {error && (
                <p className="file-upload-zone-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};
