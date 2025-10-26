/**
 * Storage Configuration
 * Configuración para el almacenamiento de archivos
 * Soporte para storage local y futuras integraciones con S3/Azure Blob
 */

import { config } from './environment';

export interface StorageConfig {
  type: 'local' | 's3' | 'azure';
  uploadDir: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}

export const storageConfig: StorageConfig = {
  type: 'local', // Por ahora solo local, expandible a S3/Azure
  uploadDir: config.UPLOAD_DIR,
  maxFileSize: config.MAX_FILE_SIZE,
  allowedMimeTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ],
  allowedExtensions: ['pdf', 'docx'],
};

/**
 * Configuración futura para AWS S3
 */
export interface S3Config {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

/**
 * Configuración futura para Azure Blob Storage
 */
export interface AzureBlobConfig {
  connectionString: string;
  containerName: string;
}
