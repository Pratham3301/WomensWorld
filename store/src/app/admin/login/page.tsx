'use client';

import { Suspense, useActionState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAdmin } from '@/app/actions/auth';
import { Lock, Mail, ArrowRight } from 'lucide-react';

function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await loginAdmin(prevState, formData);
    },
    { error: undefined, success: undefined } as { error?: string; success?: boolean }
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';

  useEffect(() => {
    if (state?.success) {
      router.push(redirectTo);
    }
  }, [state?.success, router, redirectTo]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#4A3B32] mb-2" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-[#8B7355]/50" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="block w-full pl-10 pr-3 py-3 border border-[#E8DCC4] rounded-lg focus:ring-[#8B9D83] focus:border-[#8B9D83] bg-[#FDFBF7] text-[#4A3B32] placeholder-[#8B7355]/50 transition-colors"
            placeholder="admin@womensworld.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#4A3B32] mb-2" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-[#8B7355]/50" />
          </div>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="block w-full pl-10 pr-3 py-3 border border-[#E8DCC4] rounded-lg focus:ring-[#8B9D83] focus:border-[#8B9D83] bg-[#FDFBF7] text-[#4A3B32] placeholder-[#8B7355]/50 transition-colors"
            placeholder="••••••••"
          />
        </div>
      </div>

      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
          <span className="block w-1.5 h-1.5 rounded-full bg-red-600" />
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || state?.success}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4A3B32] hover:bg-[#3A2E27] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A3B32] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 group"
      >
        {isPending ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Sign In
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#E8B3A2]/20 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] bg-[#8B9D83]/20 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative z-10 border border-[#E8DCC4]">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-[#4A3B32] mb-2">Women&apos;s World</h1>
            <p className="text-[#8B7355] text-sm tracking-widest uppercase">Admin Portal</p>
          </div>

          <Suspense fallback={<div className="text-center py-8 text-sm text-[#8B7355]">Loading portal...</div>}>
            <LoginForm />
          </Suspense>
        </div>
        
        {/* Subtle decorative bottom border */}
        <div className="h-2 w-full bg-gradient-to-r from-[#E8B3A2] via-[#E8DCC4] to-[#8B9D83]" />
      </div>
    </div>
  );
}
