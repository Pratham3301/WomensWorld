'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from './ProductCard';
import {
  ArrowRight,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  ChevronRight,
  Sparkles,
  Star,
} from 'lucide-react';
import { WHATSAPP_PHONE } from './WhatsAppWidget';

type Product = Parameters<typeof ProductCard>[0]['product'];

/* ── Scroll-triggered reveal hook ─────────────────────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ── Section Header Component ─────────────────────────────────── */
function SectionHeader({
  eyebrow,
  title,
  align = 'left',
  className = '',
}: {
  eyebrow: string;
  title: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`scroll-reveal ${align === 'center' ? 'text-center' : ''} ${className}`}
    >
      <div
        className={`ornament-divider mb-3 max-w-[120px] ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#C5A46D] flex-shrink-0" />
      </div>
      <span className="text-xs sm:text-sm font-sans font-semibold tracking-[0.2em] uppercase text-[#C5A46D] block mb-1.5">
        {eyebrow}
      </span>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#121212] uppercase tracking-wide leading-tight">
        {title}
      </h2>
    </div>
  );
}

/* ── Parallax Hero Image Hook ─────────────────────────────────── */
function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrolled = window.scrollY;
      ref.current.style.transform = `translateY(${scrolled * speed}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

export default function HomeContent({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'kids' | 'occasion'>('all');
  const [heroLoaded, setHeroLoaded] = useState(false);
  const parallaxRef = useParallax(0.25);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category?.slug === activeTab;
  });

  const categoryTiles = [
    {
      title: "Women's Festive Couture",
      desc: 'Anarkalis, Lehengas & Suit Sets',
      img: '/images/hero_boutique.jpg',
      href: '/category/women',
      span: 'col-span-1 md:col-span-2 row-span-2',
    },
    {
      title: 'Daily Handloom Kurtas',
      desc: 'Breathable pure cottons & linens',
      img: '/images/kurta.jpg',
      href: '/category/women',
      span: 'col-span-1',
    },
    {
      title: "Kids' Party & Festive",
      desc: 'Comfortable ethnic wear for little ones',
      img: '/images/frock.jpg',
      href: '/category/kids',
      span: 'col-span-1',
    },
    {
      title: 'Bridal & Occasion Wear',
      desc: 'Heavy zari embroidery & rich silks',
      img: '/images/occasion_banner.jpg',
      href: '/category/occasion-wear',
      span: 'col-span-1 md:col-span-2',
    },
  ];

  const testimonials = [
    { name: 'Priya S.', city: 'Mumbai', text: 'The lehenga I ordered was absolutely stunning — better than what I expected. The fabric quality is premium and the fit was perfect!', rating: 5 },
    { name: 'Ananya R.', city: 'Pune', text: 'Love the WhatsApp ordering experience! Got my custom-sized kurti delivered in 3 days. Will definitely order again.', rating: 5 },
    { name: 'Meera K.', city: 'Bangalore', text: 'Best boutique for occasion wear. My daughter\'s party frock was the highlight of the event. Beautiful embroidery work!', rating: 5 },
  ];

  /* ── Scroll reveal refs ─────────────────────────────────── */
  const catRef = useScrollReveal();
  const productsRef = useScrollReveal();
  const atelierRef = useScrollReveal();
  const trustRef = useScrollReveal();
  const testimonialRef = useScrollReveal();

  return (
    <div className="w-full flex flex-col bg-[#FAF9F6]">
      {/* ── 1. CINEMATIC PARALLAX HERO ────────────────────────────────── */}
      <section className="relative w-full min-h-[92vh] lg:min-h-[96vh] flex items-end overflow-hidden bg-[#0A0A0A]">
        {/* Parallax Background */}
        <div ref={parallaxRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <Image
            src="/images/hero_boutique.jpg"
            alt="Women's World Fashion Collection"
            fill
            priority
            className={`object-cover object-top transition-all duration-[2s] ${
              heroLoaded ? 'opacity-55 scale-100 animate-ken-burns' : 'opacity-0 scale-110'
            }`}
            sizes="100vw"
          />
        </div>

        {/* Cinematic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/50 via-transparent to-transparent" />

        {/* Decorative Gold Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A46D]/60 to-transparent" />

        {/* Floating Decorative Elements */}
        <div className="absolute top-[20%] right-[8%] w-32 h-32 rounded-full border border-[#C5A46D]/10 animate-float hidden lg:block" />
        <div className="absolute top-[35%] right-[12%] w-16 h-16 rounded-full border border-[#C5A46D]/15 animate-float" style={{ animationDelay: '2s' }} />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 lg:pb-24 flex flex-col justify-end">
          <div className="max-w-2xl text-left">
            <span
              className={`text-xs sm:text-sm font-sans font-semibold tracking-[0.25em] uppercase block mb-4 transition-all duration-1000 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <span className="text-shimmer">Summer &bull; Festive Collection 2026</span>
            </span>

            <h1
              className={`font-display text-4xl sm:text-6xl lg:text-[5.5rem] font-normal text-white leading-[1.02] tracking-tight mb-6 transition-all duration-1000 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              Handcrafted
              <br />
              <span className="italic font-serif text-[#C5A46D]">Silhouettes</span> &amp;
              <br />
              Contemporary Separates.
            </h1>

            <p
              className={`font-sans text-base sm:text-lg text-white/70 leading-relaxed mb-10 max-w-lg font-light transition-all duration-1000 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              Carefully curated Indian ethnic wear, occasion lehengas, and tailored daily
              essentials from our Nashik boutique.
            </p>

            <div
              className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all duration-1000 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '900ms' }}
            >
              <Link
                href="/category/women"
                className="btn-magnetic inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#121212] hover:bg-[#C5A46D] hover:text-white font-sans font-semibold text-sm tracking-[0.14em] uppercase rounded-full shadow-lg transition-colors duration-300"
              >
                Shop Collection <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/category/occasion-wear"
                className="btn-magnetic inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/5 hover:bg-white/15 text-white border border-[#C5A46D]/30 hover:border-[#C5A46D] font-sans font-semibold text-sm tracking-[0.14em] uppercase rounded-full backdrop-blur-sm transition-all duration-300"
              >
                Occasion &amp; Bridal
              </Link>
            </div>
          </div>

          {/* Hero Scroll Indicator */}
          <div className="absolute bottom-6 right-6 sm:right-12 flex flex-col items-center gap-2">
            <span className="text-[9px] text-white/40 tracking-widest uppercase font-sans rotate-90 origin-bottom-left translate-x-3 hidden sm:block">
              Scroll
            </span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#C5A46D] to-transparent" />
          </div>
        </div>
      </section>

      {/* ── 2. CURATED CATEGORY LOOKBOOK ────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-12 py-20 sm:py-28 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <SectionHeader eyebrow="Curated Edits" title="Shop by Category" />
          <Link
            href="/category/women"
            className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold tracking-wider uppercase text-[#121212] hover:text-[#C5A46D] transition-colors group"
          >
            View Full Catalog{' '}
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div
          ref={catRef}
          className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[270px] sm:auto-rows-[310px]"
        >
          {categoryTiles.map((cat, i) => (
            <Link
              key={cat.title}
              href={cat.href}
              className={`group relative rounded-2xl overflow-hidden border border-[#E8E4DC] bg-[#0A0A0A] card-lift ${cat.span}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Image
                src={cat.img}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center opacity-80 group-hover:opacity-95 image-zoom"
              />
              {/* Dual gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Gold accent line on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A46D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <p className="text-xs sm:text-sm font-sans text-[#C5A46D] uppercase tracking-widest mb-1.5">
                  {cat.desc}
                </p>
                <h3 className="font-display text-xl sm:text-2xl text-white mb-2.5 leading-tight">
                  {cat.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-white/80 group-hover:text-[#C5A46D] transition-colors tracking-wider uppercase">
                  Explore{' '}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. PRODUCT SHOWCASE WITH ANIMATED TABS ─────────────── */}
      <section className="px-4 sm:px-6 lg:px-12 py-20 sm:py-28 bg-white border-y border-[#E8E4DC] relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #121212 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />

        <div className="max-w-[1440px] mx-auto relative">
          {/* Header & Tabs */}
          <div
            ref={productsRef}
            className="scroll-reveal flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6"
          >
            <SectionHeader eyebrow="New Arrivals" title="Trending Now" />

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'women', label: "Women's" },
                { id: 'kids', label: 'Kids' },
                { id: 'occasion', label: 'Occasion Wear' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-full text-sm font-sans font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer duration-300 ${
                    activeTab === tab.id
                      ? 'bg-[#121212] text-white shadow-md'
                      : 'bg-[#FAF9F6] text-[#6E6A64] hover:text-[#121212] border border-[#E8E4DC] hover:border-[#C5A46D]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid with staggered reveal */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.slice(0, 8).map((product, i) => (
              <div
                key={product.id}
                className="animate-reveal opacity-0"
                style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'forwards' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Browse All Button */}
          <div className="mt-14 text-center">
            <Link
              href="/category/women"
              className="btn-magnetic inline-flex items-center gap-2.5 px-10 py-4 rounded-full border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white font-sans font-semibold text-sm tracking-[0.16em] uppercase transition-all duration-300"
            >
              Browse All Products ({products.length}){' '}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. TESTIMONIALS / SOCIAL PROOF ─────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-12 py-20 sm:py-28 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-14">
          <SectionHeader
            eyebrow="What Our Clients Say"
            title="Loved by Women Across India"
            align="center"
          />
        </div>

        <div
          ref={testimonialRef}
          className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-[#E8E4DC] hover:border-[#C5A46D]/40 card-lift relative overflow-hidden group"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Subtle gold corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#C5A46D]/5 to-transparent rounded-bl-[60px]" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-3.5 h-3.5 text-[#C5A46D] fill-[#C5A46D]"
                  />
                ))}
              </div>

              <p className="font-sans text-base text-[#2A2825] leading-relaxed mb-6 font-light italic">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C5A46D] to-[#B8697A] flex items-center justify-center text-white font-semibold text-xs">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-sans text-sm font-semibold text-[#121212]">{t.name}</p>
                  <p className="text-xs text-[#6E6A64]">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. THE NASHIK ATELIER & BESPOKE TAILORING ────────────────── */}
      <section className="px-4 sm:px-6 lg:px-12 py-20 sm:py-28 max-w-[1440px] mx-auto w-full">
        <div
          ref={atelierRef}
          className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gradient-to-br from-[#F4F0E8] via-[#FAF9F6] to-[#F4F0E8] rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#E8E4DC] relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#C5A46D]/8 to-transparent rounded-br-[80px]" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#C5A46D]/8 to-transparent rounded-tl-[80px]" />

          <div className="relative">
            <SectionHeader eyebrow="Atelier • Nashik" title="A Legacy of Fabric & Custom Fit." className="mb-5" />

            <p className="font-sans text-base text-[#2A2825] leading-relaxed mb-6 font-light">
              Every garment in our collection is curated in-house. Unsure about fit or need
              minor alterations for a special event? Message us directly on WhatsApp with your
              measurements and we will tailor it before shipping.
            </p>

            <div className="space-y-3.5 mb-8 text-sm text-[#2A2825]">
              {[
                'Pure tested cottons, georgettes, and silk blends',
                'Personal sizing guidance directly with our store team',
                'Transparent boutique pricing with no retail middleman markup',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#C5A46D]/10 flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                'Hello! I would like to inquire about custom sizing for an outfit.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="btn-magnetic inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#121212] hover:bg-[#25D366] text-white font-sans font-semibold text-sm uppercase tracking-wider transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current text-[#25D366] group-hover:text-white" />
              Consult on WhatsApp
            </a>
          </div>

          {/* Store Location Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E4DC] shadow-sm space-y-5 relative overflow-hidden">
            {/* Gold top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A46D] via-[#E8D5B0] to-[#C5A46D]" />

            <h3 className="font-display text-lg uppercase tracking-wide text-[#121212] pb-3 border-b border-[#E8E4DC]">
              Visit Our Flagship Store
            </h3>

            <div className="space-y-4 text-sm text-[#6E6A64]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF9F6] flex items-center justify-center flex-shrink-0 border border-[#E8E4DC]">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A46D]" />
                </div>
                <span className="pt-1.5">
                  Women&apos;s World Boutique<br />
                  Indira Nagar, Near City Center<br />
                  Nashik, Maharashtra 422009
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF9F6] flex items-center justify-center flex-shrink-0 border border-[#E8E4DC]">
                  <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
                </div>
                <span>Monday &ndash; Sunday: 10:30 AM &ndash; 9:00 PM</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF9F6] flex items-center justify-center flex-shrink-0 border border-[#E8E4DC]">
                  <Phone className="w-3.5 h-3.5 text-[#C5A46D]" />
                </div>
                <span>+91 98765 43210</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#C5A46D] font-semibold hover:text-[#121212] transition-colors flex items-center gap-1"
              >
                Get Directions on WhatsApp <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. PREMIUM TRUST PILLARS ──────────────────────────────────── */}
      <section className="w-full bg-[#121212] py-16 sm:py-20 relative overflow-hidden">
        {/* Subtle gold gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#C5A46D]/5 via-transparent to-[#C5A46D]/5" />

        <div
          ref={trustRef}
          className="scroll-reveal max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-left sm:text-center">
            {[
              {
                icon: Truck,
                title: 'Nationwide Delivery',
                desc: 'Free express shipping on orders over ₹499',
              },
              {
                icon: MessageCircle,
                title: 'WhatsApp Orders',
                desc: 'Order & consult directly with our team',
              },
              {
                icon: RotateCcw,
                title: '7-Day Exchange',
                desc: "Doorstep exchange if size isn\u0027t perfect",
              },
              {
                icon: ShieldCheck,
                title: 'Secure Checkout',
                desc: 'UPI, NetBanking, Cards & COD accepted',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="flex flex-col sm:items-center group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-[#C5A46D]/10 flex items-center justify-center mb-4 group-hover:bg-[#C5A46D]/20 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-[#C5A46D] stroke-[1.5]" />
                </div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-white mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-white/50 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
