'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, Heart, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { getWhatsAppOrderUrl } from './WhatsAppWidget';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  images: { url: string }[];
  category: { name: string; slug: string };
  variants?: { id?: string; size?: string | null }[];
}

export default function ProductCard({ product }: { product: Product }) {
  const isSale = !!product.discountPrice;
  const discountPercentage = isSale
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;
  const finalPrice = product.discountPrice ?? product.price;

  const defaultSizes: string[] =
    product.variants && product.variants.length > 0
      ? (product.variants.map((v) => v.size).filter(Boolean) as string[])
      : ['S', 'M', 'L', 'XL'];

  const [selectedSize, setSelectedSize] = useState<string>(defaultSizes[0] || 'M');
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isSaved = useWishlistStore((s) => s.hasItem(product.id));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: finalPrice,
      quantity: 1,
      size: selectedSize,
      image: product.images[0]?.url,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const whatsappUrl = getWhatsAppOrderUrl(product.name, finalPrice, selectedSize);

  return (
    <div className="group flex flex-col w-full relative bg-white rounded-2xl overflow-hidden border border-[#E8E4DC] hover:border-[#C5A46D]/40 card-lift">
      {/* Image Stage */}
      <div className="relative aspect-[3/4] bg-[#F4F0E8] overflow-hidden">
        <Link href={`/product/${product.id}`} className="block relative h-full w-full">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover object-top image-zoom transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <Image
              src="/images/product_placeholder.jpg"
              alt="Placeholder"
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover object-top opacity-50"
            />
          )}

          {/* Loading skeleton shimmer */}
          {!imageLoaded && product.images[0] && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#F4F0E8] via-[#E8E4DC] to-[#F4F0E8] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          )}
        </Link>

        {/* Badges */}
        {isSale && (
          <div className="absolute top-3 left-3 bg-[#7A2232] text-white px-3 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full shadow-md flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-white/60 animate-pulse-soft" />
            {discountPercentage}% OFF
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              discountPrice: product.discountPrice,
              image: product.images[0]?.url,
              categorySlug: product.category?.slug,
            });
          }}
          aria-label={mounted && isSaved ? 'Remove from wishlist' : 'Save item'}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-300 ${
            mounted && isSaved
              ? 'bg-[#7A2232] text-white shadow-md scale-110'
              : 'bg-white/90 text-[#121212] hover:bg-white hover:scale-110 shadow-sm backdrop-blur-sm'
          }`}
        >
          <Heart
            className={`h-3.5 w-3.5 transition-transform duration-300 ${mounted && isSaved ? 'scale-110' : ''}`}
            fill={mounted && isSaved ? 'currentColor' : 'none'}
            strokeWidth={1.75}
          />
        </button>

        {/* Direct WhatsApp Quick Pill on Hover */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 left-3 right-3 z-10 py-2.5 px-3 glass-dark text-white text-xs font-medium tracking-wide rounded-xl flex items-center justify-center gap-2 shadow-xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 border border-white/10 hover:bg-[#25D366]"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current" /> Order Size {selectedSize} on WhatsApp
        </a>
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Eyebrow */}
          <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#C5A46D] mb-1">
            {product.category?.name || 'Exclusive'}
          </p>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block group/title">
            <h3 className="font-sans text-base font-semibold text-[#121212] group-hover/title:text-[#C5A46D] transition-colors duration-200 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-1.5 mb-3">
            <span className="text-lg font-bold text-[#121212]">
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            {isSale && (
              <span className="text-sm text-[#6E6A64] line-through font-normal">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Size Selectors */}
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            {defaultSizes.slice(0, 5).map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`h-7 min-w-[28px] px-2 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedSize === size
                    ? 'bg-[#121212] text-white border border-[#121212] shadow-sm'
                    : 'bg-[#FAF9F6] text-[#121212] border border-[#E8E4DC] hover:border-[#C5A46D]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Button Actions */}
        <div className="grid grid-cols-5 gap-2 pt-3 border-t border-[#E8E4DC]">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`col-span-4 py-2.5 px-3 rounded-xl text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer btn-magnetic ${
              isAdded
                ? 'bg-[#1B4D3E] text-white'
                : 'bg-[#121212] hover:bg-[#2A2825] text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
              </>
            )}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            title="Order directly on WhatsApp"
            className="col-span-1 py-2.5 rounded-xl border border-[#E8E4DC] hover:border-[#25D366] hover:bg-[#25D366]/5 text-[#121212] hover:text-[#25D366] flex items-center justify-center transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </a>
        </div>
      </div>
    </div>
  );
}
