'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export const WHATSAPP_PHONE = '919876543210';

export function getWhatsAppOrderUrl(productName: string, price: number, size?: string) {
  const message = `Hello Women's World! 👋\nI am interested in ordering this piece from your online store:\n\n• Item: ${productName}\n• Price: ₹${price.toLocaleString('en-IN')}\n• Size: ${size || 'Standard'}\n\nPlease confirm availability and delivery timeframe.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [showPulse, setShowPulse] = useState(true);

  // Subtle attention-grab pulse every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const text = customMsg.trim() || "Hello Women's World! I have a question regarding sizes and availability.";
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
    setCustomMsg('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Concierge Popover */}
      {isOpen && (
        <div className="mb-3 w-[300px] sm:w-[340px] glass-dark text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-reveal-scale">
          {/* Header with gradient */}
          <div className="p-4 bg-gradient-to-r from-[#1E1E1E] to-[#121212] border-b border-white/10 flex items-center justify-between relative overflow-hidden">
            {/* Gold accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A46D]/30 to-transparent" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white flex items-center justify-center shadow-md">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold tracking-wide text-white flex items-center gap-1.5">
                  Atelier Concierge
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                </h4>
                <p className="text-[11px] text-white/40">Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Chat bubble style message */}
            <div className="bg-white/8 rounded-xl rounded-tl-sm p-3.5 text-xs text-white/80 leading-relaxed border border-white/5">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A46D] flex-shrink-0 mt-0.5" />
                <p>
                  Have questions about fabric, custom alterations, or immediate dispatch? We assist you directly on WhatsApp.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendCustom} className="flex gap-2 pt-1">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Ask about size, fabric, delivery..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C5A46D]/50 transition-colors"
              />
              <button
                type="submit"
                className="bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:opacity-90 text-white px-3.5 py-2.5 rounded-xl flex items-center justify-center transition-all shadow-md"
                aria-label="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#2DE26E] hover:to-[#25D366] text-white px-5 py-3.5 rounded-full shadow-xl transition-all duration-300 group btn-magnetic"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        {showPulse && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        )}

        <MessageCircle className="w-4.5 h-4.5 fill-current relative z-10" />
        <span className="font-sans font-semibold text-xs tracking-wider uppercase pr-0.5 hidden sm:inline relative z-10">
          WhatsApp Store
        </span>
      </button>
    </div>
  );
}
