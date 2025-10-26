/**
 * Extended Express Types
 * Extiende los tipos de Express para incluir propiedades customizadas
 */

import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};
