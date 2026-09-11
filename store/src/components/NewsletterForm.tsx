'use client';

import { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-xl bg-[#C5A46D]/10 border border-[#C5A46D]/20 text-white text-xs font-sans flex items-center gap-3 animate-reveal">
        <div className="w-8 h-8 rounded-full bg-[#C5A46D]/20 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-[#C5A46D]" />
        </div>
        <span className="text-white/80">Thank you for subscribing. We will keep you updated with exclusive drops.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2.5">
      <div className="relative flex-1">
        <input
          type="email"
          required
          placeholder="Enter your email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/8 border border-white/12 rounded-full px-5 py-3.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C5A46D]/50 transition-colors"
        />
      </div>
      <button
        type="submit"
        className="btn-magnetic px-6 py-3.5 rounded-full bg-[#C5A46D] hover:bg-[#B8935C] text-[#121212] font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors flex-shrink-0 cursor-pointer shadow-md"
      >
        <span>Subscribe</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
