import { Prisma } from '@prisma/client';
import { prisma } from '~/db/client';
import { UniqueConstraintError } from '~/db/errors';

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
      where: { id }
    });
  }

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  static async getById(id: string) {
    return await prisma.user.findUniqueOrThrow({
      where: { id }
    });
  }

  static async getByEmail(email: string) {
    return await prisma.user.findUniqueOrThrow({
      where: { email }
    });
  }
}
