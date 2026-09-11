'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashPassword, comparePasswords, signToken } from '@/lib/auth';
import { generateOTP, verifyOTP } from '@/lib/otp';

// Step 1: Initiate Registration with OTP
export async function registerCustomerInit(prevState: any, formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  if (!firstName || !lastName || !email || !password || !phone) {
    return { error: 'All fields are required.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  try {
    const existingEmail = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return { error: 'An account with this email already exists.' };
    }

    const existingPhone = await prisma.customer.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      return { error: 'An account with this phone number already exists.' };
    }

    // Generate and send OTP (simulated via console)
    await generateOTP(email, 'registration');

    return { 
      success: true, 
      requireOTP: true, 
      identifier: email,
      // We pass these back to the client to submit with the OTP
      userData: { firstName, lastName, email, phone, password } 
    };
  } catch (error) {
    console.error('Registration init error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

// Step 2: Verify OTP and complete Registration
export async function registerCustomerVerify(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const otp = formData.get('otp') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  const verification = await verifyOTP(email, otp, 'registration');
  if (!verification.isValid) {
    return { error: verification.error };
  }

  try {
    const hashedPassword = await hashPassword(password);

    const newCustomer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        passwordHash: hashedPassword,
        isEmailVerified: true,
      },
    });

    const token = await signToken({ userId: newCustomer.id, role: 'customer' });

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'customer_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return { success: true };
  } catch (error) {
    console.error('Registration verify error:', error);
    return { error: 'Failed to create account.' };
  }
}

// Step 1: Initiate Login with OTP
export async function loginCustomerInit(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      return { error: 'Invalid email or password.' };
    }

    const isValidPassword = await comparePasswords(password, customer.passwordHash);

    if (!isValidPassword) {
      return { error: 'Invalid email or password.' };
    }

    // Generate and send OTP for login
    await generateOTP(email, 'login');

    return { success: true, requireOTP: true, identifier: email };
  } catch (error) {
    console.error('Login init error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

// Step 2: Verify OTP and complete Login
export async function loginCustomerVerify(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const otp = formData.get('otp') as string;

  const verification = await verifyOTP(email, otp, 'login');
  if (!verification.isValid) {
    return { error: verification.error };
  }

  try {
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) return { error: 'Customer not found.' };

    const token = await signToken({ userId: customer.id, role: 'customer' });

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'customer_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return { success: true };
  } catch (error) {
    return { error: 'Failed to log in.' };
  }
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete('customer_token');
}
