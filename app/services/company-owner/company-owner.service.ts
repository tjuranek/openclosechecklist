import { UniqueConstraintError } from '~/db/errors';
import { Prisma } from '@prisma/client';
import { prisma } from '~/db/client';

export class CompanyOwnerService {
  static async createCompanyOwner(userId: string, companyId: string) {
    try {
      return await prisma.companyOwner.create({
        data: {
          userId,
          companyId
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UniqueConstraintError(
          'This user is already an owner of this company.'
        );
      }

      throw error;
    }
  }

  static async getByCompanyId(companyId: string) {
    return await prisma.companyOwner.findMany({
      where: { companyId },
      include: {
        user: true
      }
    });
  }

  static async getCompanyOwnersByCompanyId(companyId: string) {
    return await prisma.companyOwner.findMany({
      where: { companyId },
      include: { user: true }
    });
  }
}
