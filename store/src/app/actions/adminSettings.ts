'use server';

import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateStoreSettings(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  const shippingFee = parseFloat(formData.get('shippingFee') as string);
  const taxRate = parseFloat(formData.get('taxRate') as string);
  const contactEmail = formData.get('contactEmail') as string;
  const contactPhone = formData.get('contactPhone') as string;

  try {
    await prisma.storeSettings.upsert({
      where: { id: 'global' },
      update: {
        shippingFee,
        taxRate,
        contactEmail,
        contactPhone,
      },
      create: {
        id: 'global',
        shippingFee,
        taxRate,
        contactEmail,
        contactPhone,
      }
    });

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    console.error('Failed to update store settings:', error);
    return { error: 'Failed to update store settings.' };
  }
}
