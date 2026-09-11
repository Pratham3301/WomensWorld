'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Helper to check if user is admin
async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) throw new Error('Unauthorized');
  
  const payload = await verifyToken(token);
  if (!payload) throw new Error('Unauthorized');
  
  return true;
}

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function createProduct(formData: FormData) {
  await requireAdmin();

  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const discountPriceStr = formData.get('discountPrice') as string;
    const discountPrice = discountPriceStr ? parseFloat(discountPriceStr) : null;
    const categoryId = formData.get('categoryId') as string;
    const isActive = formData.get('isActive') === 'on';

    // Backend Validations
    if (!name || !categoryId || isNaN(price)) {
      throw new Error('Name, category, and a valid price are required.');
    }
    if (price <= 0) {
      throw new Error('Price must be greater than 0.');
    }
    if (discountPrice !== null && discountPrice >= price) {
      throw new Error('Discount price must be less than the regular price.');
    }
    
    // Handle Image Upload
    const imageFile = formData.get('imageFile') as File | null;
    let imageUrl = formData.get('imageUrl') as string; // fallback if they type a URL

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      
      imageUrl = `/uploads/${filename}`;
    }

    // Parse variants (sizes)
    const sizesStr = formData.get('sizes') as string;
    const sizes = sizesStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const stock = parseInt(formData.get('stock') as string) || 10;

    if (!name || !description || !price || !categoryId || !imageUrl) {
      return { error: 'Missing required fields or image.' };
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        discountPrice,
        categoryId,
        isActive,
        images: {
          create: [{ url: imageUrl }]
        },
        variants: {
          create: sizes.length > 0 
            ? sizes.map(size => ({ size, stock }))
            : [{ stock }] // Single variant without size if none provided
        }
      }
    });

    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath(`/category/[slug]`, 'page');
    
    return { success: true, productId: product.id };
  } catch (error) {
    console.error('Error creating product:', error);
    return { error: 'Failed to create product' };
  }
}

export async function deleteProduct(productId: string) {
  await requireAdmin();

  try {
    await prisma.product.delete({
      where: { id: productId }
    });

    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/product/[id]', 'page');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: 'Failed to delete product' };
  }
}

export async function toggleProductStatus(productId: string, currentStatus: boolean) {
  await requireAdmin();

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: !currentStatus }
    });

    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath(`/product/${productId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating product status:', error);
    return { error: 'Failed to update status' };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const discountPriceStr = formData.get('discountPrice') as string;
    const discountPrice = discountPriceStr && discountPriceStr !== '' ? parseFloat(discountPriceStr) : null;
    const categoryId = formData.get('categoryId') as string;
    const isActive = formData.get('isActive') === 'on';
    const stock = parseInt(formData.get('stock') as string) || 10;

    if (!name || !price || !categoryId) {
      return { error: 'Name, price and category are required.' };
    }

    // Handle optional new image
    const imageFile = formData.get('imageFile') as File | null;
    let newImageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const { writeFile, mkdir } = await import('fs/promises');
      const { join } = await import('path');
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, filename), buffer);
      newImageUrl = `/uploads/${filename}`;
    } else {
      const imageUrlField = formData.get('imageUrl') as string;
      if (imageUrlField && imageUrlField.trim() !== '') {
        newImageUrl = imageUrlField.trim();
      }
    }

    // Update core product fields
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        discountPrice,
        categoryId,
        isActive,
      },
    });

    // Update stock on all variants
    const variants = await prisma.variant.findMany({ where: { productId } });
    for (const v of variants) {
      await prisma.variant.update({ where: { id: v.id }, data: { stock } });
    }

    // Replace image if a new one was provided
    if (newImageUrl) {
      await prisma.image.deleteMany({ where: { productId } });
      await prisma.image.create({ data: { url: newImageUrl, productId } });
    }

    revalidatePath('/');
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath('/category/[slug]', 'page');
    revalidatePath(`/product/${productId}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { error: 'Failed to update product' };
  }
}
