'use server';

import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { sendOrderStatusEmail } from '@/lib/email';


export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
    });
    
    // Notify customer in the background
    await sendOrderStatusEmail(orderId, status);

    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update order status' };
  }
}

export async function updatePaymentStatus(orderId: string, status: string) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status },
    });
    
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update payment status' };
  }
}
