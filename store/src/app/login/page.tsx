'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginCustomerInit, loginCustomerVerify } from '@/app/actions/customerAuth';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [requireOTP, setRequireOTP] = useState(false);
  const [identifier, setIdentifier] = useState('');

  async function handleLoginInit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    const result = await loginCustomerInit(null, formData);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else if (result.requireOTP) {
      setRequireOTP(true);
      setIdentifier(result.identifier as string);
    }
  }

  async function handleOTPVerify(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    // Append identifier securely to the form data
    formData.append('email', identifier);
    
    const result = await loginCustomerVerify(null, formData);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      router.push('/account');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-12 pb-24 md:pt-20">
      <div className="max-w-[480px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="ornament-divider w-16">
              {requireOTP ? (
                <ShieldCheck className="w-4 h-4 text-[#C5A46D] flex-shrink-0" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#C5A46D] flex-shrink-0" />
              )}
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#121212] uppercase tracking-wider mb-2">
            {requireOTP ? 'Security Check' : 'Welcome Back'}
          </h1>
          <p className="text-sm font-sans text-[#6E6A64] font-light">
            {requireOTP 
              ? `We sent a 6-digit verification code to ${identifier}` 
              : 'Log in to access your curated wishlist and recent orders.'}
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E4DC] shadow-sm">
          {!requireOTP ? (
            <form action={handleLoginInit} className="space-y-5">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D] transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212]">
                    Password
                  </label>
                  <Link href="#" className="text-xs text-[#6E6A64] hover:text-[#C5A46D] transition-colors font-medium">
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs font-medium text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#121212] hover:bg-[#C5A46D] text-white rounded-xl font-sans font-semibold text-sm uppercase tracking-wider transition-colors disabled:opacity-50 mt-2 btn-magnetic flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Verifying...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form action={handleOTPVerify} className="space-y-5">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212] mb-1.5 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  name="otp"
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-2xl tracking-[0.5em] text-center text-[#121212] focus:outline-none focus:border-[#C5A46D] transition-colors"
                  placeholder="------"
                  autoFocus
                />
                <p className="text-xs text-[#6E6A64] text-center mt-3 font-light">
                  Tip: Check your terminal logs for the simulated OTP.
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-medium text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#121212] hover:bg-[#C5A46D] text-white rounded-xl font-sans font-semibold text-sm uppercase tracking-wider transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Authenticating...' : 'Verify & Login'} <ShieldCheck className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => { setRequireOTP(false); setError(null); }}
                className="w-full py-2 text-xs font-sans font-semibold text-[#6E6A64] hover:text-[#121212] uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
            </form>
          )}

          {!requireOTP && (
            <div className="mt-8 text-center text-sm font-sans text-[#6E6A64]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#121212] font-semibold hover:text-[#C5A46D] transition-colors">
                Create one
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
