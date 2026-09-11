'use client';

import Link from 'next/link';
import { useWishlistStore, useCartStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addItemToCart = useCartStore((state) => state.addItem);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-12 pb-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-[#C5A46D] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-4 pb-24 md:pt-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E8E4DC]">
          <div>
            <div className="ornament-divider mb-2 max-w-[80px]">
              <Heart className="w-3.5 h-3.5 text-[#C5A46D] flex-shrink-0 fill-[#C5A46D]" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-[#121212] uppercase tracking-wide mb-1.5">
              Your Wishlist
            </h1>
            <p className="text-sm text-[#6E6A64] font-sans font-light">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-sans font-semibold tracking-wider uppercase text-[#6E6A64] hover:text-[#7A2232] transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-[#E8E4DC] p-8 relative overflow-hidden card-lift">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[30%] left-[20%] w-32 h-32 rounded-full bg-[#C5A46D]/5 blur-3xl" />
            </div>
            <div className="w-16 h-16 rounded-full bg-[#F4F0E8] flex items-center justify-center mb-6 relative">
              <Heart className="w-6 h-6 text-[#C5A46D]" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-[#121212] uppercase tracking-wide mb-3 relative">
              Your Wishlist is Empty
            </h2>
            <p className="text-sm font-sans text-[#6E6A64] mb-8 font-light leading-relaxed max-w-sm relative">
              Explore our collections and tap the heart icon to save your favorite pieces for later.
            </p>
            <Link
              href="/category/women"
              className="btn-magnetic inline-flex items-center gap-2.5 px-8 py-4 bg-[#121212] hover:bg-[#C5A46D] text-white font-sans font-semibold text-sm tracking-wider uppercase rounded-full transition-colors duration-300 shadow-md relative"
            >
              Explore Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item, i) => {
              const finalPrice = item.discountPrice ?? item.price;
              const isSale = !!item.discountPrice;
              
              return (
                <div
                  key={item.id}
                  className="group flex flex-col w-full relative bg-white rounded-2xl overflow-hidden border border-[#E8E4DC] hover:border-[#C5A46D]/40 card-lift animate-reveal opacity-0"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="relative aspect-[3/4] bg-[#F4F0E8] overflow-hidden">
                    <Link href={`/product/${item.id}`} className="block relative h-full w-full">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover object-top image-zoom"
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
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleItem(item);
                      }}
                      aria-label="Remove from wishlist"
                      className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 text-[#121212] hover:bg-white hover:text-[#7A2232] shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-grow justify-between bg-white">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#C5A46D] mb-1">
                        {item.categorySlug ? item.categorySlug.replace('-', ' ') : 'Saved Item'}
                      </p>
                      <Link href={`/product/${item.id}`} className="block group/title">
                        <h3 className="font-sans text-base font-semibold text-[#121212] group-hover/title:text-[#C5A46D] transition-colors duration-200 line-clamp-1 leading-snug">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-baseline gap-2 mt-1.5 mb-3">
                        <span className="text-lg font-bold text-[#121212]">
                          ₹{finalPrice.toLocaleString('en-IN')}
                        </span>
                        {isSale && (
                          <span className="text-sm text-[#6E6A64] line-through font-normal">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E8E4DC]">
                      <button
                        type="button"
                        onClick={() => {
                          addItemToCart({
                            id: `${item.id}-M`,
                            productId: item.id,
                            name: item.name,
                            price: finalPrice,
                            quantity: 1,
                            size: 'M',
                            image: item.image,
                          });
                          toggleItem(item);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#C5A46D] text-white transition-all duration-300 cursor-pointer btn-magnetic"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
