import { UniqueConstraintError } from '~/db/errors';
import { Prisma } from '@prisma/client';
import { prisma } from '~/db/client';

export class LocationManagerService {
  static async createLocationManager(userId: string, locationId: string) {
    try {
      return await prisma.locationManager.create({
        data: {
          userId,
          locationId
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UniqueConstraintError(
          'This user is already a manager of this location.'
        );
      }

      throw error;
    }
  }

  static async getLocationManagerById(id: string) {
    return await prisma.locationManager.findUnique({
      where: { id, deletedAt: null }
    });
  }

  static async getLocationManagersByUserId(userId: string) {
    return await prisma.locationManager.findMany({
      where: { userId, deletedAt: null },
      include: { location: true }
    });
  }

  static async getLocationManagersByLocationId(locationId: string) {
    return await prisma.locationManager.findMany({
      where: { locationId, deletedAt: null },
      include: { user: true }
    });
  }

  static async findByCompanyId(companyId: string) {
    return await prisma.locationManager.findMany({
      where: {
        location: {
          companyId
        },
        deletedAt: null
      },
      include: {
        user: true
      }
    });
  }

  static async softDeleteByCompanyIdAndUserId(
    companyId: string,
    userId: string
  ) {
    const currentDate = new Date();

    return await prisma.locationManager.updateMany({
      where: {
        userId,
        location: {
          companyId
        },
        deletedAt: null
      },
      data: {
        deletedAt: currentDate
      }
    });
  }
}
