import { prisma } from "~/db/client";

export async function createCompanyWithOwner(name: string, companyOwnerId: string) {
  return await prisma.companies.create({
    data: {
      name,
      companyOwners: {
        create: {
          userId: companyOwnerId
        }
      }
    },
  });
}

export async function getCompanyById(id: string) {
  return await prisma.companies.findUnique({
    where: { id },
  });
}

export async function getCompanyByName(name: string) {
  return await prisma.companies.findFirst({
    where: { name },
  });
}

export async function updateCompany(id: string, name: string) {
  return await prisma.companies.update({
    where: { id },
    data: { name },
  });
}

export async function deleteCompany(id: string) {
  return await prisma.companies.delete({
    where: { id },
  });
}

export async function getCompanyLocations(companyId: string) {
  return await prisma.companies.findUnique({
    where: { id: companyId },
    include: { locations: true },
  });
}

export async function getCompanyOwners(companyId: string) {
  return await prisma.companies.findUnique({
    where: { id: companyId },
    include: { companyOwners: { include: { user: true } } },
  });
}

export async function addCompanyOwner(companyId: string, userId: string) {
  return await prisma.companyOwners.create({
    data: {
      company: { connect: { id: companyId } },
      user: { connect: { id: userId } },
    },
  });
}

export async function removeCompanyOwner(companyOwnerId: string) {
  return await prisma.companyOwners.delete({
    where: { id: companyOwnerId },
  });
}
