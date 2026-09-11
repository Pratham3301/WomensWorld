import { PrismaClient } from '@prisma/client';
import { createProduct } from '@/app/actions/product';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductFormClient from './ProductFormClient';

const prisma = new PrismaClient();

export default async function CreateProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/products" 
          className="p-2 text-[#8B7355] hover:bg-[#FDFBF7] rounded-lg transition-colors border border-transparent hover:border-[#E8DCC4]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif text-[#4A3B32]">Add New Product</h1>
          <p className="text-sm text-[#8B7355] mt-1">Create a new product listing in your catalog.</p>
        </div>
      </div>

      <ProductFormClient categories={categories} />
    </div>
  );
}
