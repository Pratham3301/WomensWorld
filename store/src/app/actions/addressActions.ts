'use server';

import prisma from '@/lib/prisma';
import { getCustomerSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addAddress(formData: FormData) {
  const session = await getCustomerSession();
  if (!session || session.role !== 'customer') {
    return { error: 'Unauthorized' };
  }

  const label = formData.get('label') as string || 'Home';
  const street = formData.get('street') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const pincode = formData.get('pincode') as string;
  
  if (!street || !city || !state || !pincode) {
    return { error: 'All fields are required' };
  }

  try {
    // If this is the first address, make it default
    const count = await prisma.address.count({ where: { customerId: session.userId as string } });
    
    await prisma.address.create({
      data: {
        label,
        street,
        city,
        state,
        pincode,
        isDefault: count === 0,
        customerId: session.userId as string,
      }
    });

    revalidatePath('/account');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to add address' };
  }
}

export async function deleteAddress(addressId: string) {
  const session = await getCustomerSession();
  if (!session || session.role !== 'customer') return { error: 'Unauthorized' };

  try {
    await prisma.address.delete({
      where: { 
        id: addressId,
        customerId: session.userId as string // Ensure they own it
      }
    });
    revalidatePath('/account');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete address' };
  }
}
