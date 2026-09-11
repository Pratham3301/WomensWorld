"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { WHATSAPP_PHONE } from "@/components/WhatsAppWidget";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 bg-[#FAF9F6]">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#E8E4DC] text-center max-w-md w-full">
          <div className="w-16 h-16 bg-[#F4F0E8] rounded-full flex items-center justify-center mx-auto mb-5 text-[#121212]">
            <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h1 className="font-display text-2xl text-[#121212] uppercase tracking-wide mb-2">
            Your Bag is Empty
          </h1>
          <p className="text-sm font-sans text-[#6E6A64] mb-6 font-light leading-relaxed">
            Discover our new season festive drops, cotton kurtis, and occasion lehengas.
          </p>
          <Link
            href="/category/women"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#121212] text-white font-sans font-semibold text-xs uppercase tracking-[0.14em] rounded-lg hover:bg-[#2A2825] transition-colors"
          >
            Explore Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  const whatsappCartMessage = `Hello Women's World Atelier! 👋\nI would like to order the following items in my bag:\n\n${items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (Size: ${item.size || 'Standard'}, Qty: ${item.quantity || 1}) - ₹${(
          item.price * (item.quantity || 1)
        ).toLocaleString('en-IN')}`
    )
    .join('\n')}\n\n• Total: ₹${total.toLocaleString('en-IN')}\n\nPlease confirm availability and delivery timeframe.`;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-4 pb-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 max-w-[1440px] w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-[#121212] uppercase tracking-wide">
            Shopping Bag <span className="text-[#6E6A64]">({totalCount})</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Items */}
          <div className="flex-1 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E4DC] flex gap-4 sm:gap-5 relative"
              >
                <Link
                  href={`/product/${item.productId}`}
                  className="relative h-28 w-20 sm:h-32 sm:w-24 flex-shrink-0 bg-[#F4F0E8] rounded-lg overflow-hidden"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-center"
                      sizes="96px"
                    />
                  ) : (
                    <Image
                      src="/images/product_placeholder.jpg"
                      alt="Placeholder"
                      fill
                      className="object-cover opacity-40"
                      sizes="96px"
                    />
                  )}
                </Link>

                <div className="flex flex-col flex-1 justify-between">
                  <div className="pr-8">
                    <Link
                      href={`/product/${item.productId}`}
                      className="font-sans text-sm sm:text-base font-semibold text-[#121212] hover:text-[#7A2232] transition-colors line-clamp-1 mb-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-[#6E6A64] font-medium mb-1">
                      Size: <span className="text-[#121212] font-semibold">{item.size ?? 'Standard'}</span>
                    </p>
                    <p className="text-sm font-bold text-[#121212]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-[#FAF9F6] rounded-md border border-[#E8E4DC] p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 text-[#121212] hover:bg-white rounded transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-semibold text-sm text-[#121212]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-[#121212] hover:bg-white rounded transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-[#121212]">
                      Subtotal: ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 p-1.5 text-[#6E6A64] hover:text-[#7A2232] transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E4DC] sticky top-28 space-y-5">
              <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-[#121212] border-b border-[#E8E4DC] pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-[#6E6A64]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#121212]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-[#1B4D3E]">FREE</span>
                  ) : (
                    <span className="font-bold text-[#121212]">₹{shipping}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#E8E4DC] pt-3 flex justify-between items-baseline">
                <span className="font-sans font-bold text-sm uppercase tracking-wider text-[#121212]">
                  Total
                </span>
                <span className="font-sans text-2xl font-bold text-[#121212]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center py-3.5 bg-[#121212] hover:bg-[#2A2825] text-white rounded-lg font-sans font-semibold text-sm uppercase tracking-[0.14em] shadow-sm transition-colors"
              >
                Proceed to Checkout
              </Link>

              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappCartMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full text-center py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-sans font-semibold text-sm uppercase tracking-wider shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order Bag on WhatsApp</span>
              </a>

              <div className="pt-3 border-t border-[#E8E4DC] space-y-1.5 text-xs text-[#6E6A64] font-light">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#121212]" />
                  <span>100% Encrypted Checkout Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#121212]" />
                  <span>Express Dispatch within 48 Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
