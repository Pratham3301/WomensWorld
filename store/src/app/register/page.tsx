'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerCustomerInit, registerCustomerVerify } from '@/app/actions/customerAuth';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [requireOTP, setRequireOTP] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [cachedData, setCachedData] = useState<any>(null);

  async function handleRegisterInit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    
    // Front-end Validations
    const phone = formData.get('phone') as string;
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit Indian phone number.");
      setIsSubmitting(false);
      return;
    }

    const password = formData.get('password') as string;
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }

    const result = await registerCustomerInit(null, formData);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else if (result.requireOTP) {
      setRequireOTP(true);
      setIdentifier(result.identifier as string);
      setCachedData(result.userData);
    }
  }

  async function handleOTPVerify(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    
    // Append the cached registration data safely to the form
    Object.keys(cachedData).forEach(key => {
      formData.append(key, cachedData[key]);
    });
    
    const result = await registerCustomerVerify(null, formData);
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
            {requireOTP ? 'Verify Email' : 'Create Account'}
          </h1>
          <p className="text-sm font-sans text-[#6E6A64] font-light">
            {requireOTP 
              ? `We sent a 6-digit verification code to ${identifier}` 
              : "Join Women's World to track your exclusive orders."}
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E4DC] shadow-sm">
          {!requireOTP ? (
            <form action={handleRegisterInit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D] transition-colors"
                    placeholder="First"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D] transition-colors"
                    placeholder="Last"
                  />
                </div>
              </div>

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
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D] transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#121212] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D] transition-colors"
                  placeholder="At least 8 characters"
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
                {isSubmitting ? 'Sending Code...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
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
                {isSubmitting ? 'Verifying...' : 'Verify & Register'} <ShieldCheck className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => { setRequireOTP(false); setError(null); }}
                className="w-full py-2 text-xs font-sans font-semibold text-[#6E6A64] hover:text-[#121212] uppercase tracking-wider transition-colors"
              >
                Back to Registration
              </button>
            </form>
          )}

          {!requireOTP && (
            <div className="mt-8 text-center text-sm font-sans text-[#6E6A64]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#121212] font-semibold hover:text-[#C5A46D] transition-colors">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
