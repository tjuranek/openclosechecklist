import { User } from '@prisma/client';

export function getUserInitials(user: Pick<User, 'firstName' | 'lastName'>) {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
}
