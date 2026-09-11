import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "@/components/ProductClient";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });
  } catch(e) {}

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const imageUrl = product.images[0]?.url || '/placeholder.png';
  const price = product.discountPrice ?? product.price;

  return {
    title: `${product.name} | Women's World`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: imageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.slice(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product = null;
  
  try {
    product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        variants: true,
        reviews: {
          orderBy: { createdAt: "desc" },
        },
        relatedProducts: {
          take: 4,
          include: { images: true },
        },
      },
    });
  } catch(e) {
    console.error("Database connection failed during build:", e);
  }

  if (!product) notFound();

  let related = product.relatedProducts || [];
  if (related.length === 0) {
    related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
      take: 4,
      include: { images: true, category: true }
    });
  }

  return <ProductClient product={product} relatedProducts={related} />;
}
