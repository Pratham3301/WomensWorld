import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductEditClient from './ProductEditClient';

export const dynamic = 'force-dynamic';

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true, category: true },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-[#4A3B32]">Edit Product</h1>
        <p className="text-sm text-[#8B7355] mt-1">Update details for &quot;{product.name}&quot;</p>
      </div>
      <ProductEditClient product={product} categories={categories} />
    </div>
  );
}
