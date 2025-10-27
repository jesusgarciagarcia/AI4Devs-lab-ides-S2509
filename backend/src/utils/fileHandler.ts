import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { logger } from './logger';
import { InternalServerError } from './errors';

const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const statAsync = promisify(fs.stat);

class FileOperationError extends InternalServerError {
  constructor(operation: string, details?: any) {
    super(`File operation failed: ${operation}`);
    this.details = details;
  }
}

export class FileHandler {
  private readonly uploadDir: string;
  private readonly maxRetries = 3;

  constructor(uploadDir: string = 'uploads') {
    this.uploadDir = uploadDir;
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await mkdirAsync(this.uploadDir, { recursive: true });
      await mkdirAsync(path.join(this.uploadDir, 'cvs'), { recursive: true });
    } catch (error) {
      logger.error('Failed to create upload directories', { error });
      throw new FileOperationError('directory creation', { error });
    }
  }

  async saveFile(
    file: Express.Multer.File,
    subfolder: string = '',
  ): Promise<string> {
    try {
      const folderPath = this.buildFolderPath(subfolder);
      await this.ensureDirectoryExists(folderPath);

      if (file.path) {
        return this.normalizeFilePath(subfolder, path.basename(file.path));
      }

      if (file.buffer) {
        const filename = this.generateUniqueFilename(
          subfolder,
          file.originalname,
        );
        const filePath = path.join(folderPath, filename);
        await new Promise<void>((resolve, reject) => {
          fs.writeFile(filePath, file.buffer as any, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        logger.info('File saved successfully', {
          filename,
          size: file.size,
          mimetype: file.mimetype,
        });

        return this.normalizeFilePath(subfolder, filename);
      }

      throw new FileOperationError('save', {
        reason: 'No file path or buffer provided',
      });
    } catch (error) {
      logger.error('Error saving file', { error, filename: file.originalname });
      throw new FileOperationError('save', {
        error,
        filename: file.originalname,
      });
    }
  }

  private buildFolderPath(subfolder: string): string {
    return subfolder ? path.join(this.uploadDir, subfolder) : this.uploadDir;
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    await mkdirAsync(dirPath, { recursive: true });
  }

  private generateUniqueFilename(
    subfolder: string,
    originalName: string,
  ): string {
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e9);
    const extension = path.extname(originalName);
    return `${subfolder}-${timestamp}-${randomSuffix}${extension}`;
  }

  private normalizeFilePath(subfolder: string, filename: string): string {
    return path.join(subfolder, filename).replace(/\\/g, '/');
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filePath = this.getFilePath(fileUrl);

      if (!this.fileExists(fileUrl)) {
        logger.warn('File not found for deletion', { fileUrl });
        return;
      }

      await unlinkAsync(filePath);
      logger.info('File deleted successfully', { fileUrl });
    } catch (error) {
      logger.error('Error deleting file', { error, fileUrl });
    }
  }

  getFilePath(fileUrl: string): string {
    return path.join(this.uploadDir, fileUrl);
  }

  fileExists(fileUrl: string): boolean {
    return fs.existsSync(this.getFilePath(fileUrl));
  }

  async getFileInfo(fileUrl: string): Promise<fs.Stats | null> {
    try {
      const filePath = this.getFilePath(fileUrl);
      return await statAsync(filePath);
    } catch (error) {
      logger.error('Error getting file info', { error, fileUrl });
      return null;
    }
  }
}

export const fileHandler = new FileHandler();
