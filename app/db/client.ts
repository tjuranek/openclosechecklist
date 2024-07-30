import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient;
}

if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}

global.__prisma.$connect();

/**
 * Treat this as a singleton instance of PrismaClient.
 */
export const prisma = global.__prisma;
