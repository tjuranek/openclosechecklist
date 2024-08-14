import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ScottJuranek = await prisma.user.create({
    data: {
      firstName: 'Scott',
      lastName: 'Juranek',
      email: 'dev+scott@thomasjuranek.com'
    }
  });

  const DarcyJuranek = await prisma.user.create({
    data: {
      firstName: 'Darcy',
      lastName: 'Juranek',
      email: 'dev+darcy@thomasjuranek.com'
    }
  });

  const AvaJuranek = await prisma.user.create({
    data: {
      firstName: 'Ava',
      lastName: 'Juranek',
      email: 'dev+ava@thomasjuranek.com'
    }
  });

  const CallieHedlund = await prisma.user.create({
    data: {
      firstName: 'Callie',
      lastName: 'Hedlund',
      email: 'dev+callie@thomasjuranek.com'
    }
  });

  const NisswaCourtyard = await prisma.company.create({
    data: {
      name: 'Nisswa Courtyard'
    }
  });

  const NisswaCourtyardOwners = await prisma.companyOwner.createMany({
    data: [
      {
        companyId: NisswaCourtyard.id,
        userId: ScottJuranek.id
      },
      {
        companyId: NisswaCourtyard.id,
        userId: DarcyJuranek.id
      }
    ]
  });

  const Nisswa = await prisma.location.create({
    data: {
      name: 'Nisswa',
      companyId: NisswaCourtyard.id
    }
  });

  const NisswaLocationManagers = await prisma.locationManager.createMany({
    data: [
      {
        locationId: Nisswa.id,
        userId: AvaJuranek.id
      },
      {
        locationId: Nisswa.id,
        userId: CallieHedlund.id
      }
    ]
  });
}

main();
