const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const kurta = await prisma.product.findFirst({ where: { name: { contains: 'Kurta' } } });
  if (kurta) await prisma.image.updateMany({ where: { productId: kurta.id }, data: { url: '/images/kurta.jpg' } });

  const frock = await prisma.product.findFirst({ where: { name: { contains: 'Frock' } } });
  if (frock) await prisma.image.updateMany({ where: { productId: frock.id }, data: { url: '/images/frock.jpg' } });

  const saree = await prisma.product.findFirst({ where: { name: { contains: 'Saree' } } });
  if (saree) await prisma.image.updateMany({ where: { productId: saree.id }, data: { url: '/images/saree.jpg' } });

  const lehenga = await prisma.product.findFirst({ where: { name: { contains: 'Lehenga' } } });
  if (lehenga) await prisma.image.updateMany({ where: { productId: lehenga.id }, data: { url: '/images/lehenga.jpg' } });

  console.log('Images updated in database!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
