const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  
  await prisma.adminUser.upsert({
    where: { email: 'admin@womensworld.com' },
    update: { passwordHash: hash },
    create: {
      email: 'admin@womensworld.com',
      passwordHash: hash,
      role: 'admin'
    }
  });

  console.log('✅ Admin password successfully reset to: admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
