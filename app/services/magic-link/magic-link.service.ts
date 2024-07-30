import { Prisma } from "@prisma/client";
import { prisma } from "~/db/client";
import { env } from "~/constants/env";

export class MagicLinkService {
  static async createMagicLink(userId: string) {
    try {
      const token = Math.random().toString(36).substring(2, 9);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      await prisma.magicLink.create({
        data: {
          userId,
          token,
          expiresAt
        }
      });

      return `${env.BASE_URL}/verify-magic-link?token=${token}`;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors if needed
        console.error("Prisma error:", error.code);
      }
      throw error;
    }
  }

  static async verifyMagicLink(token: string) {
    try {
      const magicLink = await prisma.magicLink.findFirst({
        where: {
          token,
          expiresAt: {
            gt: new Date()
          }
        },
        include: {
          user: true
        }
      });

      if (!magicLink) {
        return null;
      }

      await prisma.magicLink.deleteMany({
        where: {
          userId: magicLink.userId
        }
      });

      return magicLink.user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors if needed
        console.error("Prisma error:", error.code);
      }
      throw error;
    }
  }
}
