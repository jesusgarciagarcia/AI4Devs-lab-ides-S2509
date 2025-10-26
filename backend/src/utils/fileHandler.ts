/**
 * File Handler Utility
 * Maneja la subida, almacenamiento y eliminación de archivos
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { logger } from './logger';

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

export class FileHandler {
  private uploadDir: string;

  constructor(uploadDir: string = 'uploads') {
    this.uploadDir = uploadDir;
    this.ensureUploadDirectory();
  }

  /**
   * Asegura que el directorio de uploads existe
   */
  private async ensureUploadDirectory(): Promise<void> {
    try {
      await mkdirAsync(this.uploadDir, { recursive: true });
      await mkdirAsync(path.join(this.uploadDir, 'cvs'), { recursive: true });
    } catch (error) {
      logger.error('Error creating upload directories', { error });
    }
  }

  /**
   * Guarda un archivo en el sistema de archivos
   * @param file - Archivo de Multer
   * @param subfolder - Subcarpeta dentro de uploads (ej: 'cvs')
   * @returns URL relativa del archivo guardado
   */
  async saveFile(
    file: Express.Multer.File,
    subfolder: string = '',
  ): Promise<string> {
    try {
      const folderPath = subfolder
        ? path.join(this.uploadDir, subfolder)
        : this.uploadDir;

      // Asegurar que la subcarpeta existe
      await mkdirAsync(folderPath, { recursive: true });

      // Generar nombre único
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const extension = path.extname(file.originalname);
      const filename = `${subfolder}-${uniqueSuffix}${extension}`;
      const filePath = path.join(folderPath, filename);

      // Si Multer ya guardó el archivo, no hacer nada más
      // Si no, escribir el buffer
      if (file.path) {
        // Archivo ya está guardado por Multer
        return path
          .join(subfolder, path.basename(file.path))
          .replace(/\\/g, '/');
      } else if (file.buffer) {
        // Guardar desde buffer
        await fs.promises.writeFile(filePath, file.buffer as any);
      }

      const relativePath = path.join(subfolder, filename).replace(/\\/g, '/');

      logger.info('File saved successfully', {
        filename,
        size: file.size,
        mimetype: file.mimetype,
      });

      return relativePath;
    } catch (error) {
      logger.error('Error saving file', { error, filename: file.originalname });
      throw new Error('Error al guardar el archivo');
    }
  }

  /**
   * Elimina un archivo del sistema
   * @param fileUrl - URL relativa del archivo (ej: 'cvs/cv-123456.pdf')
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, fileUrl);

      // Verificar si el archivo existe
      if (fs.existsSync(filePath)) {
        await unlinkAsync(filePath);
        logger.info('File deleted successfully', { fileUrl });
      } else {
        logger.warn('File not found for deletion', { fileUrl });
      }
    } catch (error) {
      logger.error('Error deleting file', { error, fileUrl });
      // No lanzar error, solo loggear (archivo puede no existir)
    }
  }

  /**
   * Obtiene el path completo de un archivo
   */
  getFilePath(fileUrl: string): string {
    return path.join(this.uploadDir, fileUrl);
  }

  /**
   * Verifica si un archivo existe
   */
  fileExists(fileUrl: string): boolean {
    const filePath = this.getFilePath(fileUrl);
    return fs.existsSync(filePath);
  }

  /**
   * Obtiene información de un archivo
   */
  async getFileInfo(fileUrl: string): Promise<fs.Stats | null> {
    try {
      const filePath = this.getFilePath(fileUrl);
      return await fs.promises.stat(filePath);
    } catch (error) {
      logger.error('Error getting file info', { error, fileUrl });
      return null;
    }
  }
}

// Instancia singleton
export const fileHandler = new FileHandler();
