// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   const adminPassword = 'admin123'; // You should change this password
//   const hashedPassword = await bcrypt.hash(adminPassword, 10);

//   const admin = await prisma.user.upsert({
//     where: { username: 'admin' },
//     update: {},
//     create: {
//       username: 'admin',
//       password: hashedPassword,
//       service: 'AUTRES_SERVICES',
//       role: 'admin',
//     },
//   });

//   console.log('Admin user created:', admin);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });