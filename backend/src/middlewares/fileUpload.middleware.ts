/**
 * File Upload Middleware
 * Configura Multer para el manejo de archivos
 */

import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { BadRequestError } from '../utils/errors';
import { storageConfig } from '../config/storage';

// Configuración de storage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(storageConfig.uploadDir, 'cvs');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para evitar colisiones
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    const sanitizedName = file.originalname
      .replace(extension, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 50);

    cb(null, `cv-${sanitizedName}-${uniqueSuffix}${extension}`);
  },
});

// Filtro de tipos de archivo
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Verificar tipo MIME
  if (!storageConfig.allowedMimeTypes.includes(file.mimetype)) {
    cb(
      new BadRequestError(
        `Tipo de archivo no permitido. Solo se permiten: ${storageConfig.allowedExtensions.join(', ')}`,
      ),
    );
    return;
  }

  // Verificar extensión
  const extension = path.extname(file.originalname).toLowerCase().substring(1);
  if (!storageConfig.allowedExtensions.includes(extension)) {
    cb(
      new BadRequestError(
        `Extensión de archivo no permitida. Solo se permiten: ${storageConfig.allowedExtensions.join(', ')}`,
      ),
    );
    return;
  }

  cb(null, true);
};

// Configuración de Multer
export const uploadCV = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: storageConfig.maxFileSize, // 5MB por defecto
    files: 1, // Solo un archivo a la vez
  },
});

/**
 * Middleware para manejar errores de Multer
 */
export const handleMulterError = (
  error: any,
  req: Request,
  res: any,
  next: any,
) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return next(
          new BadRequestError(
            `El archivo excede el tamaño máximo permitido (${Math.round(storageConfig.maxFileSize / 1024 / 1024)}MB)`,
          ),
        );
      case 'LIMIT_FILE_COUNT':
        return next(
          new BadRequestError('Solo se permite subir un archivo a la vez'),
        );
      case 'LIMIT_UNEXPECTED_FILE':
        return next(new BadRequestError('Campo de archivo inesperado'));
      default:
        return next(
          new BadRequestError(`Error al subir archivo: ${error.message}`),
        );
    }
  }
  next(error);
};
