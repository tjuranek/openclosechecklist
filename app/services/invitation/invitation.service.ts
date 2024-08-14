// /app/services/invitation/invitation.service.ts

import { UniqueConstraintError } from '~/db/errors';
import { Prisma } from '@prisma/client';
import { prisma } from '~/db/client';

export class InvitationService {
  static async create(data: {
    email: string;
    companyId?: string;
    locationId?: string;
  }) {
    try {
      return await prisma.invitation.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UniqueConstraintError(
          'An invitation for this email and company/location already exists.'
        );
      }

      throw error;
    }
  }

  static async findById(id: string) {
    return await prisma.invitation.findUnique({
      where: { id },
      include: {
        company: true,
        location: true
      }
    });
  }

  static async getById(id: string) {
    return await prisma.invitation.findUniqueOrThrow({
      where: { id },
      include: {
        company: true,
        location: true
      }
    });
  }

  static async findByEmail(email: string) {
    return await prisma.invitation.findMany({
      where: { email },
      include: {
        company: true,
        location: true
      }
    });
  }

  static async getByCompanyId(companyId: string) {
    return await prisma.invitation.findMany({
      where: { companyId },
      include: {
        company: true
      }
    });
  }

  static async getByLocationId(locationId: string) {
    return await prisma.invitation.findMany({
      where: { locationId },
      include: {
        location: true
      }
    });
  }

  static async update(
    id: string,
    data: { email?: string; companyId?: string; locationId?: string }
  ) {
    return await prisma.invitation.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  static async delete(id: string) {
    return await prisma.invitation.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }

  static async hardDelete(id: string) {
    return await prisma.invitation.delete({
      where: { id }
    });
  }
}
