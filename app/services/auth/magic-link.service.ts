import { env } from "~/constants/env";
import { prisma } from "~/db/client";

export async function createMagicLink(userId: string) {
  const token = Math.random().toString(36).substring(2, 9);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.magicLinks.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });  

  return `${env.BASE_URL}/verify-magic-link?token=${token}`;
}

export async function verifyMagicLink(token: string) {
  const magicLink = await prisma.magicLinks.findFirst({
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

  await prisma.magicLinks.deleteMany({
    where: {
      userId: magicLink.userId
    }
  });

  return magicLink.user;
}