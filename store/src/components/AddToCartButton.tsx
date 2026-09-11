'use client';

import { useCartStore } from '@/lib/store';
import { useState } from 'react';
import { ShoppingBag, Check, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getWhatsAppOrderUrl } from './WhatsAppWidget';

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  selectedSize: string;
  quantity: number;
  isKids?: boolean;
}

export default function AddToCartButton({ product, selectedSize, quantity }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity > 0 ? quantity : 1,
      size: selectedSize || 'OS',
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const whatsappUrl = getWhatsAppOrderUrl(product.name, product.price, selectedSize);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Add to Bag */}
        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center font-sans font-bold text-xs tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer btn-magnetic ${
            added
              ? 'bg-[#1B4D3E] text-white shadow-md'
              : 'bg-[#121212] hover:bg-[#2A2825] text-white shadow-sm'
          }`}
        >
          {added ? (
            <span className="flex items-center gap-2 animate-reveal">
              <Check className="w-4 h-4 text-emerald-400" />
              Added to Bag ({quantity})
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </span>
          )}
        </button>

        {/* WhatsApp Direct Order */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#2DE26E] hover:to-[#25D366] text-white font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all duration-300 btn-magnetic"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Order on WhatsApp</span>
        </a>
      </div>

      {added && (
        <Link
          href="/cart"
          className="py-3.5 px-6 rounded-xl bg-white border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white font-sans font-bold text-center text-xs tracking-[0.14em] uppercase transition-all duration-300 flex items-center justify-center gap-2 animate-reveal btn-magnetic"
        >
          View Shopping Bag <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
