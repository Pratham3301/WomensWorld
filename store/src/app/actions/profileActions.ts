'use server';

import prisma from '@/lib/prisma';
import { getCustomerSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const session = await getCustomerSession();
  if (!session || session.role !== 'customer') {
    return { error: 'Unauthorized' };
  }

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const phone = formData.get('phone') as string;

  if (!firstName || !lastName) {
    return { error: 'First name and last name are required.' };
  }

  try {
    await prisma.customer.update({
      where: { id: session.userId as string },
      data: {
        firstName,
        lastName,
        phone,
      },
    });

    revalidatePath('/account');
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { error: 'Failed to update profile.' };
  }
}
