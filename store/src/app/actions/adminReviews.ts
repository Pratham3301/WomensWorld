'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';

export async function toggleReviewVerification(reviewId: string, currentStatus: boolean) {
  const session = await getAdminSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { isVerified: !currentStatus },
    });

    revalidatePath('/admin/reviews');
    revalidatePath(`/product/${updatedReview.productId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle review verification:', error);
    return { error: 'Failed to update review status.' };
  }
}

export async function deleteReview(reviewId: string) {
  const session = await getAdminSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const deletedReview = await prisma.review.delete({
      where: { id: reviewId },
    });

    revalidatePath('/admin/reviews');
    revalidatePath(`/product/${deletedReview.productId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to delete review:', error);
    return { error: 'Failed to delete review.' };
  }
}
