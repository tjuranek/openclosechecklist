import { Prisma } from "@prisma/client";
import { prisma } from "~/db/client";
import { UniqueConstraintError } from "~/db/errors";

export class CompanyOwnerService {
  static async createCompanyOwner(userId: string, companyId: number) {
    try {
      return await prisma.companyOwner.create({
        data: {
          userId,
          companyId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new UniqueConstraintError(
          "This user is already an owner of this company."
        );
      }

      throw error;
    }
  }

  static async getCompanyOwnerById(id: number) {
    return await prisma.companyOwner.findUnique({
      where: { id },
    });
  }

  static async getCompanyOwnersByUserId(userId: string) {
    return await prisma.companyOwner.findMany({
      where: { userId },
      include: { company: true },
    });
  }

  static async getCompanyOwnersByCompanyId(companyId: number) {
    return await prisma.companyOwner.findMany({
      where: { companyId },
      include: { user: true },
    });
  }
}
