'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReview(formData: FormData) {
  const productId = formData.get('productId') as string;
  const rating = parseInt(formData.get('rating') as string, 10);
  const title = formData.get('title') as string | null;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;

  if (!productId || !rating || !content || !author) {
    return { error: 'Missing required fields' };
  }

  if (rating < 1 || rating > 5) {
    return { error: 'Rating must be between 1 and 5' };
  }

  try {
    await prisma.review.create({
      data: {
        productId,
        rating,
        title,
        content,
        author,
        isVerified: false, // Default to false, can be toggled in admin dashboard
      },
    });

    // Revalidate the product page to show the new review instantly
    revalidatePath(`/product/${productId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to submit review:', error);
    return { error: 'Failed to submit review. Please try again later.' };
  }
}
