import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let products: any[] = [];
  let categories: any[] = [];

  try {
    // Get all active products
    products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, createdAt: true },
    });

    // Get all categories
    categories = await prisma.category.findMany({
      select: { slug: true },
    });
  } catch (error) {
    console.error("Database connection failed during sitemap generation:", error);
    // Fallback to empty arrays during Vercel build phase
  }

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/category/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
