import { Prisma } from "@prisma/client";
import { prisma } from "~/db/client";
import { UniqueConstraintError } from "~/db/errors";

export class LocationService {
  static async createLocation(name: string, companyId: number) {
    try {
      return await prisma.location.create({
        data: {
          name,
          companyId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new UniqueConstraintError(
          "A location with that name already exists for this company."
        );
      }

      throw error;
    }
  }

  static async getLocationById(id: number) {
    return await prisma.location.findUnique({
      where: { id },
    });
  }

  static async getLocationsByCompanyId(companyId: number) {
    return await prisma.location.findMany({
      where: { companyId },
    });
  }

  static async getLocationByNameAndCompanyId(name: string, companyId: number) {
    return await prisma.location.findFirst({
      where: { name, companyId },
    });
  }
}
