import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  // Create admin user
  const adminPassword = await bcrypt.hash('admin', saltRounds);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      service: 'BUREAU_DU_COURRIER',
      role: 'admin'
    }
  });

  // Create public user
  const publicPassword = await bcrypt.hash('public', saltRounds);
  await prisma.user.upsert({
    where: { username: 'public' },
    update: {},
    create: {
      username: 'public',
      password: publicPassword,
      service: 'SECTION_PUBLIC',
      role: 'public'
    }
  });

  // Create service users
  const services = [
    'BUREAU_DU_COURRIER',
    'RECETTE_DEPARTEMENTALE_DES_DOMAINES',
    'CONSERVATION_FONCIERE',
    'SERVICE_DEPARTEMENTAL_DES_DOMAINES',
    'SERVICE_DEPARTEMENTAL_DES_AFFAIRES_FONCIERES',
    'SERVICE_DEPARTEMENTAL_DU_PATRIMOINE_DE_L_ETAT',
    'SERVICE_DEPARTEMENTAL_DU_CADASTRE',
    'SECTION_PUBLIC'
  ];

  for (const service of services) {
    const username = service.toLowerCase().replace(/_/g, '');
    const password = await bcrypt.hash(username, saltRounds);
    await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        password,
        service,
        role: 'service_user'
      }
    });
  }

  console.log('Database has been seeded with initial user credentials.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });