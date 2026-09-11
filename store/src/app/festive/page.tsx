import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Festive Collection | Women's World",
};

export const revalidate = 60;

export default async function FestivePage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        slug: { in: ["occasion-wear", "kids", "women"] },
      },
    },
    take: 8,
    include: { images: true, category: true, variants: true },
    orderBy: { price: "desc" },
  });


  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24">
      {/* Festive Hero */}
      <section className="relative w-full min-h-[65vh] sm:min-h-[75vh] bg-[#0A0A0A] overflow-hidden flex items-center justify-center">
        <Image
          src="/images/festive_banner.jpg"
          alt="Festive Collection"
          fill
          priority
          className="object-cover object-center opacity-55 animate-ken-burns"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/30 via-transparent to-[#0A0A0A]/30" />

        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A46D]/60 to-transparent" />

        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="ornament-divider mb-4 max-w-[100px]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A46D] flex-shrink-0" />
          </div>

          <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.25em] uppercase block mb-3">
            <span className="text-shimmer">The Festive Edit 2026</span>
          </span>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-wide mb-4 leading-tight">
            Celebrate the <span className="italic font-serif text-[#C5A46D]">Season</span>
          </h1>

          <p className="font-sans text-sm sm:text-base text-white/60 font-light mb-10 max-w-xl leading-relaxed">
            Hand-embroidered lehengas, festive anarkalis, and joyful kids wear curated for your celebrations.
          </p>

          <Link
            href="/category/occasion-wear"
            className="btn-magnetic inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#121212] hover:bg-[#C5A46D] hover:text-white font-sans font-semibold text-xs uppercase tracking-[0.14em] rounded-full shadow-lg transition-colors duration-300"
          >
            Shop Festive <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto w-full mt-16 sm:mt-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="ornament-divider mb-3 max-w-[100px] mx-auto">
            <Sparkles className="w-3 h-3 text-[#C5A46D] flex-shrink-0" />
          </div>
          <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[#7A2232] block mb-1.5">
            Limited Availability
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#121212] uppercase tracking-wide">
            Curated Festive Specials
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="animate-reveal opacity-0"
              style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'forwards' }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
