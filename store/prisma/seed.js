const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

// ALL product images use local generated boutique assets so they never fail or 404
const IMAGES = {
  // Women's fashion
  anarkali:   '/images/kurta.jpg',
  kurti:      '/images/kurta.jpg',
  palazzo:    '/images/festive_banner.jpg',
  dress:      '/images/hero_boutique.jpg',
  casual:     '/images/kurta.jpg',
  top:        '/images/occasion_banner.jpg',
  // Kids
  girlFrock:  '/images/frock.jpg',
  boysSet:    '/images/product_placeholder.jpg',
  kidsEthnic: '/images/frock.jpg',
  // Occasion
  lehenga:    '/images/lehenga.jpg',
  saree:      '/images/saree.jpg',
  gown:       '/images/lehenga.jpg',
}

async function main() {
  console.log('🗑️  Clearing existing data...')
  await prisma.adminUser.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.image.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log('📂 Creating categories...')
  const women = await prisma.category.create({ data: { name: 'Women', slug: 'women' } })
  const kids = await prisma.category.create({ data: { name: 'Kids', slug: 'kids' } })
  const occasion = await prisma.category.create({ data: { name: 'Occasion Wear', slug: 'occasion-wear' } })

  const products = [
    // ── WOMEN (6 products) ──────────────────────────────────────────
    {
      name: 'Floral Print Anarkali Suit',
      description: 'Graceful floral-print Anarkali suit crafted from soft cotton-blend fabric. Features intricate embroidery at the neckline and hemline. Comes with matching palazzo and dupatta. Ideal for festive occasions and daily wear. The fabric is breathable and easy to wash, making it perfect for the Indian climate.',
      price: 1899,
      discountPrice: 1499,
      categoryId: women.id,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      image: IMAGES.anarkali,
    },
    {
      name: 'Premium Cotton Kurti',
      description: 'Lightweight and breathable pure-cotton kurti with a modern A-line silhouette. Ideal for everyday wear with jeans or churidar. The block-print pattern and clean finishing make it a versatile wardrobe staple that pairs with anything.',
      price: 899,
      categoryId: women.id,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      image: IMAGES.kurti,
    },
    {
      name: 'Georgette Palazzo Set',
      description: 'Elegant three-piece palazzo set featuring a short kurta, wide-leg palazzo pants, and a sheer dupatta. Premium georgette fabric that drapes beautifully. Suitable for office wear, family functions, and casual outings.',
      price: 1499,
      discountPrice: 1199,
      categoryId: women.id,
      sizes: ['S', 'M', 'L', 'XL'],
      image: IMAGES.palazzo,
    },
    {
      name: 'Midi Wrap Dress',
      description: 'Effortlessly chic midi wrap dress with a flattering cross-front bodice and a flowy skirt. Crafted from a lightweight crepe fabric that feels luxurious against the skin. Perfect for brunches, casual outings, or work days.',
      price: 1299,
      discountPrice: 999,
      categoryId: women.id,
      sizes: ['XS', 'S', 'M', 'L'],
      image: IMAGES.dress,
    },
    {
      name: 'Classic Straight Kurta',
      description: 'Simple yet stylish straight-cut kurta made from soft cotton. Features a mandarin collar, side slits, and a clean minimal design. A true wardrobe essential available in multiple colors. Pairs beautifully with any bottom wear.',
      price: 699,
      categoryId: women.id,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      image: IMAGES.casual,
    },
    {
      name: 'Printed Summer Top',
      description: 'Casual printed top perfect for summer days. Features a relaxed silhouette, round neckline, and short sleeves. Made from soft cotton-modal blend that feels cool and comfortable all day long.',
      price: 549,
      categoryId: women.id,
      sizes: ['XS', 'S', 'M', 'L'],
      image: IMAGES.top,
    },
    // ── KIDS (3 products) ──────────────────────────────────────────
    {
      name: "Girls' Frilly Party Frock",
      description: 'Adorable frilly party frock for little girls with a layered tulle skirt and glitter bow details. Soft, comfortable inner lining ensures all-day comfort. Machine-washable fabric. Perfect for birthdays, parties, and festive celebrations.',
      price: 799,
      discountPrice: 599,
      categoryId: kids.id,
      sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
      image: IMAGES.girlFrock,
    },
    {
      name: "Boys' Graphic T-Shirt & Jogger Set",
      description: 'Fun and comfortable 2-piece set featuring a graphic printed t-shirt and matching jogger pants with an elastic waistband. Premium cotton blend. Easy to wash and maintain. Great for school, playdates, and everyday wear.',
      price: 899,
      categoryId: kids.id,
      sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '7-8Y'],
      image: IMAGES.boysSet,
    },
    {
      name: 'Kids Ethnic Kurta Set',
      description: 'Classic ethnic kurta set for little ones with embroidered details in traditional colors. The soft inner lining ensures comfort throughout the day. Perfect for Eid, Diwali, weddings, and family gatherings. Made from breathable fabric that parents love.',
      price: 999,
      discountPrice: 799,
      categoryId: kids.id,
      sizes: ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y'],
      image: IMAGES.kidsEthnic,
    },
    // ── OCCASION WEAR (3 products) ────────────────────────────────
    {
      name: 'Bridal Lehenga Choli Set',
      description: 'Stunning bridal lehenga choli with heavy zari embroidery, intricate mirror work, and stone embellishments. Includes a matching blouse and dupatta. Crafted from premium silk-blend fabric. A dream ensemble for your most special day — weddings, engagements, and receptions.',
      price: 12999,
      discountPrice: 9999,
      categoryId: occasion.id,
      sizes: ['S', 'M', 'L', 'XL', 'Custom'],
      image: IMAGES.lehenga,
    },
    {
      name: 'Designer Embroidered Saree',
      description: 'Elegant designer saree with exquisite thread embroidery on a soft georgette base. Comes with a complementary silk blouse piece. Perfect for weddings, pujas, and formal gatherings. Drapes beautifully and is easy to wear even for first-timers.',
      price: 4999,
      discountPrice: 3999,
      categoryId: occasion.id,
      sizes: ['Free Size'],
      image: IMAGES.saree,
    },
    {
      name: 'Party Wear Evening Gown',
      description: 'Glamorous floor-length party gown featuring a one-shoulder design, fitted bodice, and dramatic flared skirt. Crafted from luxurious velvet-crepe blend. Available in deep jewel tones. Make a lasting impression at every party, reception, or special event.',
      price: 3499,
      categoryId: occasion.id,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      image: IMAGES.gown,
    },
  ]

  console.log('🛍️  Creating products...')
  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice ?? null,
        categoryId: p.categoryId,
        isActive: true,
        variants: {
          create: p.sizes.map(size => ({ size, stock: Math.floor(Math.random() * 20) + 5 }))
        },
        images: { create: [{ url: p.image }] }
      }
    })
  }

  console.log(`✅ Seeded ${products.length} products across 3 categories.`)

  console.log('👑 Creating default Admin user...')
  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.adminUser.upsert({
    where: { email: 'admin@womensworld.com' },
    update: {},
    create: {
      email: 'admin@womensworld.com',
      passwordHash,
      role: 'admin'
    }
  })
  console.log('✅ Admin user created (email: admin@womensworld.com, pass: admin123)')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
