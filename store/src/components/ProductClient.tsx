'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Minus,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  MessageCircle,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import { WHATSAPP_PHONE } from './WhatsAppWidget';
import ProductCard from './ProductCard';
import ProductReviews from './ProductReviews';
import { useWishlistStore } from '@/lib/store';

export default function ProductClient({
  product,
  relatedProducts,
}: {
  product: any;
  relatedProducts?: any[];
}) {
  const [mainImage, setMainImage] = useState(product.images[0]?.url);
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size || 'M');
  const [quantity, setQuantity] = useState(1);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isSaved = useWishlistStore((s) => s.hasItem(product.id));
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const isSale = !!product.discountPrice;
  const finalPrice = product.discountPrice ?? product.price;
  const discountPercent = isSale
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-4 pb-24 md:pt-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 max-w-[1440px] w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-sans text-[#6E6A64] mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link href="/" className="hover:text-[#C5A46D] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-[#C5A46D] transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#121212] font-semibold">{product.name}</span>
        </nav>

        {/* Product Split */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="w-full lg:w-3/5 flex flex-col-reverse md:flex-row gap-4 animate-reveal" style={{ animationDelay: '100ms' }}>
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
              {product.images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setMainImage(img.url)}
                  className={`relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                    mainImage === img.url
                      ? 'border-[#C5A46D] shadow-md'
                      : 'border-transparent opacity-50 hover:opacity-100 hover:border-[#E8E4DC]'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div
              ref={imageRef}
              className="relative w-full aspect-[4/5] bg-[#F4F0E8] rounded-2xl overflow-hidden shadow-sm border border-[#E8E4DC] cursor-zoom-in group/img"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-top transition-transform duration-300"
                  style={
                    isZoomed
                      ? { transform: 'scale(1.8)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                      : undefined
                  }
                />
              ) : (
                <Image
                  src="/images/product_placeholder.jpg"
                  alt="Placeholder"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover opacity-50"
                />
              )}

              {/* Zoom indicator */}
              <div className="absolute bottom-4 right-4 glass rounded-full p-2 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 pointer-events-none">
                <ZoomIn className="w-4 h-4 text-[#121212]" />
              </div>

              {/* Discount Tag */}
              {isSale && (
                <div className="absolute top-4 left-4 bg-[#7A2232] text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-white/60 animate-pulse-soft" />
                  {discountPercent}% OFF
                </div>
              )}

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => toggleWishlist({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  discountPrice: product.discountPrice,
                  image: product.images[0]?.url,
                  categorySlug: product.category?.slug,
                })}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all duration-300 ${
                  isSaved
                    ? 'bg-[#7A2232] text-white scale-110'
                    : 'bg-white/90 text-[#121212] hover:bg-white hover:scale-110 backdrop-blur-sm'
                }`}
              >
                <Heart className="w-4.5 h-4.5" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="w-full lg:w-2/5 flex flex-col justify-start animate-reveal" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-sans font-semibold tracking-[0.16em] uppercase text-[#C5A46D]">
                {product.category.name}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#121212] uppercase tracking-wide leading-tight mb-5">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-7 p-5 rounded-2xl bg-white border border-[#E8E4DC] relative overflow-hidden">
              {/* Gold corner accent */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#C5A46D]/5 to-transparent" />

              <span className="text-2xl sm:text-3xl font-bold text-[#121212] relative">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              {isSale && (
                <>
                  <span className="text-base text-[#6E6A64] line-through font-normal">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-[#7A2232] bg-[#7A2232]/8 px-2 py-0.5 rounded-full">
                    Save ₹{(product.price - finalPrice).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {/* Sizes */}
            {product.variants.length > 0 && (
              <div className="mb-7">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-sans font-bold uppercase tracking-wider text-[#121212]">
                    Select Size
                  </span>
                  <a
                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`Hi, I need sizing advice for ${product.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#C5A46D] hover:text-[#121212] flex items-center gap-1 font-medium transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> Sizing Questions?
                  </a>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedSize(variant.size)}
                      className={`px-5 py-3 rounded-xl font-sans font-semibold text-sm transition-all duration-300 cursor-pointer ${
                        selectedSize === variant.size
                          ? 'bg-[#121212] text-white border border-[#121212] shadow-md'
                          : 'bg-white text-[#121212] border border-[#E8E4DC] hover:border-[#C5A46D]'
                      }`}
                    >
                      {variant.size ?? 'Standard'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <span className="text-sm font-sans font-bold uppercase tracking-wider text-[#121212] block mb-3">
                Quantity
              </span>
              <div className="flex items-center w-[130px] bg-white rounded-xl border border-[#E8E4DC] p-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#121212] hover:bg-[#FAF9F6] rounded-lg transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center font-bold text-base text-[#121212]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#121212] hover:bg-[#FAF9F6] rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mb-8">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: finalPrice,
                  image: product.images[0]?.url,
                }}
                selectedSize={selectedSize}
                quantity={quantity}
              />
            </div>

            {/* Reassurances */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] space-y-3 mb-8 relative overflow-hidden">
              {/* Gold top line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A46D]/30 to-transparent" />

              {[
                { icon: Truck, text: 'Complimentary Shipping across India on orders over ₹499' },
                { icon: RotateCcw, text: '7-Day Easy Doorstep Exchange Policy' },
                { icon: ShieldCheck, text: '100% Genuine Handpicked Fabric from Nashik Store' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#121212]">
                  <div className="w-8 h-8 rounded-full bg-[#FAF9F6] flex items-center justify-center flex-shrink-0 border border-[#E8E4DC]">
                    <item.icon className="w-3.5 h-3.5 text-[#C5A46D]" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-t border-[#E8E4DC] pt-6 mb-6">
              <h3 className="font-sans text-sm font-bold tracking-widest uppercase text-[#121212] mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
                Product Details
              </h3>
              <p className="font-sans text-base text-[#2A2825] leading-relaxed font-light">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Lookbook */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-[#E8E4DC] pt-16">
            <div className="mb-10 flex items-center gap-3">
              <div className="ornament-divider max-w-[80px]">
                <Sparkles className="w-3 h-3 text-[#C5A46D] flex-shrink-0" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl text-[#121212] uppercase tracking-wide">
                You May Also Like
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p, i) => (
                <div
                  key={p.id}
                  className="animate-reveal opacity-0"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Reviews */}
        <ProductReviews productId={product.id} initialReviews={product.reviews || []} />
      </div>
    </div>
  );
}
