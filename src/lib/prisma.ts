import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const url = process.env.DATABASE_URL || '';
console.log('[PRISMA] Using URL:', url.replace(/:[^:@]+@/, ':****@'));

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
