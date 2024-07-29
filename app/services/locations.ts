import { prisma } from "~/db/client";

export async function createLocation(name: string, companyId: string) {
  return await prisma.locations.create({
    data: {
      name,
      company: { connect: { id: companyId } },
    },
  });
}

export async function getLocationById(id: string) {
  return await prisma.locations.findUnique({
    where: { id },
  });
}

export async function getLocationByName(name: string, companyId: string) {
  return await prisma.locations.findFirst({
    where: { name, companyId },
  });
}

export async function updateLocation(id: string, name: string) {
  return await prisma.locations.update({
    where: { id },
    data: { name },
  });
}

export async function deleteLocation(id: string) {
  return await prisma.locations.delete({
    where: { id },
  });
}

export async function getLocationChecklists(locationId: string) {
  return await prisma.locations.findUnique({
    where: { id: locationId },
    include: { checklists: true },
  });
}

export async function getLocationManagers(locationId: string) {
  return await prisma.locations.findUnique({
    where: { id: locationId },
    include: { locationManagers: { include: { user: true } } },
  });
}

export async function addLocationManager(locationId: string, userId: string) {
  return await prisma.locationManagers.create({
    data: {
      location: { connect: { id: locationId } },
      user: { connect: { id: userId } },
    },
  });
}

export async function removeLocationManager(locationManagerId: string) {
  return await prisma.locationManagers.delete({
    where: { id: locationManagerId },
  });
}

export async function getLocationUsers(locationId: string) {
  return await prisma.locations.findUnique({
    where: { id: locationId },
    include: { userLocations: { include: { user: true } } },
  });
}

export async function addUserToLocation(locationId: string, userId: string) {
  return await prisma.userLocations.create({
    data: {
      location: { connect: { id: locationId } },
      user: { connect: { id: userId } },
    },
  });
}

export async function removeUserFromLocation(userLocationId: string) {
  return await prisma.userLocations.delete({
    where: { id: userLocationId },
  });
}
