import { UniqueConstraintError } from '~/db/errors';
import { Prisma } from '@prisma/client';
import { prisma } from '~/db/client';

export class CompanyService {
  static async createCompany(name: string, ownerId: string) {
    try {
      return await prisma.company.create({
        data: {
          name,
          owners: {
            create: {
              userId: ownerId
            }
          }
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UniqueConstraintError(
          'A company with that name already exists.'
        );
      }

      throw error;
    }
  }

  static async getCompanyById(id: string) {
    return await prisma.company.findUniqueOrThrow({
      where: { id }
    });
  }

  static async getCompanyByName(name: string) {
    return await prisma.company.findFirstOrThrow({
      where: { name }
    });
  }
}
