import { UniqueConstraintError } from '~/db/errors';
import { Prisma } from '@prisma/client';
import { prisma } from '~/db/client';

export class LocationService {
  static async createLocation(companyId: string, data: { name: string }) {
    try {
      return await prisma.location.create({
        data: {
          companyId,
          ...data
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UniqueConstraintError(
          'A location with that name already exists for this company.'
        );
      }

      throw error;
    }
  }

  static async getLocationById(id: string) {
    return await prisma.location.findUniqueOrThrow({
      where: { id }
    });
  }

  static async getLocationsByCompanyId(companyId: string) {
    return await prisma.location.findMany({
      where: { companyId },
      include: {
        managers: true
      }
    });
  }

  static async getLocationByNameAndCompanyId(name: string, companyId: string) {
    return await prisma.location.findFirst({
      where: { name, companyId }
    });
  }
}
