'use server';

import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { comparePasswords, signToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function loginAdmin(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return { error: 'Invalid credentials' };
    }

    const isValidPassword = await comparePasswords(password, admin.passwordHash);

    if (!isValidPassword) {
      return { error: 'Invalid credentials' };
    }

    // Generate JWT
    const token = await signToken({ userId: admin.id, role: admin.role });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
}
