/**
 * Script to create system user
 * Run with: npx ts-node create-system-user.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSystemUser() {
  try {
    const user = await prisma.user.upsert({
      where: { email: 'system@ats.local' },
      update: {},
      create: {
        id: 'system',
        email: 'system@ats.local',
        password: 'N/A', // No se usará para login
        name: 'System User',
        role: 'ADMIN',
      },
    });

    console.log('✅ System user created/updated:', user);
  } catch (error) {
    console.error('❌ Error creating system user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createSystemUser();
