'use server';

import { getCustomerSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateOTP, verifyOTP } from '@/lib/otp';

export async function getCheckoutCustomerData() {
  const session = await getCustomerSession();
  if (!session || session.role !== 'customer') {
    return null;
  }

  const customer = await prisma.customer.findUnique({
    where: { id: session.userId as string },
    include: {
      addresses: true,
    }
  });

  return customer;
}

export async function requestCodOtp(email: string, totalAmount: number) {
  // Enforce Max COD limit (e.g., ₹3000)
  if (totalAmount > 3000) {
    return { error: 'Orders above ₹3,000 must be paid online.' };
  }

  try {
    // Generate OTP for email
    await generateOTP(email, 'cod_verification');
    return { success: true };
  } catch (error) {
    console.error('Failed to request COD OTP:', error);
    return { error: 'Failed to send OTP. Please try again.' };
  }
}

export async function verifyCodOtp(email: string, otp: string) {
  try {
    const result = await verifyOTP(email, otp, 'cod_verification');
    return result;
  } catch (error) {
    console.error('Failed to verify COD OTP:', error);
    return { isValid: false, error: 'Verification failed.' };
  }
}
