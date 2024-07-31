import { UniqueConstraintError } from '~/db/errors';
import { Prisma } from '@prisma/client';
import { prisma } from '~/db/client';

export class UserService {
  static async create(firstName: string, lastName: string, email: string) {
    try {
      return await prisma.user.create({
        data: {
          firstName,
          lastName,
          email
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UniqueConstraintError(
          'A user with that email already exists.'
        );
      }

      throw error;
    }
  }

  static async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        ownedCompanies: true,
        managedLocations: true
      }
    });
  }

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        ownedCompanies: true,
        managedLocations: true
      }
    });
  }

  static async getById(id: string) {
    return await prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        ownedCompanies: {
          include: {
            company: true
          }
        },
        managedLocations: {
          include: {
            location: {
              include: {
                company: true
              }
            }
          }
        }
      }
    });
  }

  static async getAccessibleCompanies(id: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        ownedCompanies: {
          include: {
            company: true
          }
        },
        managedLocations: {
          include: {
            location: {
              include: {
                company: true
              }
            }
          }
        }
      }
    });

    const ownedCompanies = user.ownedCompanies.map(oc => oc.company);
    const managedCompanies = user.managedLocations.map(
      ml => ml.location.company
    );

    return [...new Set([...ownedCompanies, ...managedCompanies])];
  }

  static async getByEmail(email: string) {
    return await prisma.user.findUniqueOrThrow({
      where: { email },
      include: {
        ownedCompanies: true,
        managedLocations: true
      }
    });
  }
}
