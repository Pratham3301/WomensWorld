'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Heart, MessageCircle, ChevronRight, User } from 'lucide-react';
import CartBadge from './CartBadge';
import WishlistBadge from './WishlistBadge';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { WHATSAPP_PHONE } from './WhatsAppWidget';

const NAV = [
  { label: 'New In', href: '/category/women' },
  { label: 'Women', href: '/category/women' },
  { label: 'Kids', href: '/category/kids' },
  { label: 'Occasion & Bridal', href: '/category/occasion-wear' },
  { label: 'Festive', href: '/festive' },
  { label: 'Sale', href: '/category/women?sort=price-asc', highlight: true },
];

const SEARCH_TAGS = ['Anarkali Suit', 'Cotton Kurti', 'Bridal Lehenga', 'Kids Frock', 'Silk Saree', 'Wrap Dress'];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Auto-hide header on scroll down, show on scroll up
      if (currentScrollY > 200) {
        setHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      } else {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/women?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleQuickTag = (tag: string) => {
    router.push(`/category/women?q=${encodeURIComponent(tag)}`);
    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          !headerVisible
            ? '-translate-y-full'
            : scrolled
            ? 'glass shadow-[0_1px_20px_rgba(0,0,0,0.06)] border-b border-[#E8E4DC]/50'
            : 'bg-[#FAF9F6] border-b border-[#E8E4DC]'
        }`}
      >
        {/* Premium Marquee Announcement Bar */}
        <div className="w-full bg-[#121212] text-white overflow-hidden py-2.5 border-b border-[#C5A46D]/10 relative">
          {/* Subtle gold shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A46D]/5 to-transparent" />

          <div className="animate-marquee whitespace-nowrap text-xs md:text-sm tracking-[0.2em] uppercase font-sans font-medium flex items-center relative">
            <span className="mx-6">FESTIVE & SUMMER &apos;26 EDIT</span>
            <span className="text-[#C5A46D]">&bull;</span>
            <span className="mx-6">COMPLIMENTARY SHIPPING OVER ₹499</span>
            <span className="text-[#C5A46D]">&bull;</span>
            <span className="mx-6">DIRECT SIZING &amp; CUSTOM ORDERS ON WHATSAPP</span>
            <span className="text-[#C5A46D]">&bull;</span>
            <span className="mx-6">HANDCRAFTED IN NASHIK</span>
            <span className="text-[#C5A46D]">&bull;</span>
            <span className="mx-6">EASY 7-DAY EXCHANGE POLICY</span>
            <span className="text-[#C5A46D]">&bull;</span>
            <span className="mx-6">FESTIVE & SUMMER &apos;26 EDIT</span>
            <span className="text-[#C5A46D]">&bull;</span>
            <span className="mx-6">COMPLIMENTARY SHIPPING OVER ₹499</span>
            <span className="text-[#C5A46D]">&bull;</span>
            <span className="mx-6">DIRECT SIZING &amp; CUSTOM ORDERS ON WHATSAPP</span>
            <span className="text-[#C5A46D]">&bull;</span>
            <span className="mx-6">HANDCRAFTED IN NASHIK</span>
            <span className="text-[#C5A46D]">&bull;</span>
            <span className="mx-6">EASY 7-DAY EXCHANGE POLICY</span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
          <div className="flex h-[68px] md:h-[76px] items-center justify-between">
            {/* Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 -ml-2 text-[#121212] hover:text-[#C5A46D] transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Brand Logo */}
            <Link href="/" className="flex flex-col items-center group text-center relative">
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl tracking-[0.14em] text-[#121212] uppercase font-normal group-hover:text-[#C5A46D] transition-colors duration-300">
                Women&apos;s World
              </h1>
              <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.3em] uppercase text-[#C5A46D]">
                Nashik Atelier
              </span>
              {/* Gold underline accent on hover */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#C5A46D] group-hover:w-full transition-all duration-300" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10 ml-8">
              {NAV.map((link) => {
                const isActive = pathname?.startsWith(link.href.split('?')[0]);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[13px] tracking-[0.12em] uppercase font-sans font-medium transition-all duration-300 relative py-1 group/nav ${
                      link.highlight
                        ? 'text-[#7A2232] font-semibold'
                        : isActive
                        ? 'text-[#121212] font-semibold'
                        : 'text-[#121212]/70 hover:text-[#121212]'
                    }`}
                  >
                    {link.label}
                    {/* Animated underline */}
                    <span
                      className={`absolute bottom-0 left-0 h-[1.5px] transition-all duration-300 ${
                        isActive
                          ? 'w-full bg-[#121212]'
                          : 'w-0 bg-[#C5A46D] group-hover/nav:w-full'
                      }`}
                    />
                    {/* Sale badge pulse */}
                    {link.highlight && (
                      <span className="absolute -top-1 -right-3 w-1.5 h-1.5 rounded-full bg-[#7A2232] animate-pulse-soft" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello! I am browsing Women's World and would like some assistance.")}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#121212] hover:bg-[#25D366] text-white transition-all duration-300 text-sm font-medium group/wa"
                title="Direct WhatsApp Atelier Line"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current group-hover/wa:text-white transition-colors" />
                <span className="hidden xl:inline text-xs tracking-wider uppercase">WhatsApp</span>
              </a>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-[#121212] hover:text-[#C5A46D] transition-colors rounded-full hover:bg-[#F4F0E8]"
                aria-label="Search Collection"
              >
                <Search className="h-5 w-5 stroke-[1.5]" />
              </button>

              <Link
                href="/wishlist"
                className="relative p-2.5 text-[#121212] hover:text-[#C5A46D] transition-colors hidden sm:flex rounded-full hover:bg-[#F4F0E8]"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 stroke-[1.5]" />
                <WishlistBadge />
              </Link>

              <Link
                href="/account"
                className="relative p-2.5 text-[#121212] hover:text-[#C5A46D] transition-colors hidden sm:flex rounded-full hover:bg-[#F4F0E8]"
                aria-label="Account"
              >
                <User className="h-5 w-5 stroke-[1.5]" />
              </Link>

              <Link
                href="/cart"
                className="relative p-2.5 text-[#121212] hover:text-[#C5A46D] transition-colors rounded-full hover:bg-[#F4F0E8]"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                <CartBadge />
              </Link>
            </div>
          </div>
        </div>

        {/* Search Drawer */}
        {searchOpen && (
          <div className="border-t border-[#E8E4DC] glass shadow-lg animate-slide-down">
            <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <form onSubmit={handleSearch} className="relative flex items-center gap-3 border-b-2 border-[#121212] pb-3">
                <Search className="h-5 w-5 text-[#C5A46D] flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Kurtas, Sarees, Lehengas, Dresses..."
                  autoFocus
                  className="w-full text-base bg-transparent border-none focus:outline-none placeholder:text-[#6E6A64]/50 text-[#121212] font-sans font-light"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 text-[#6E6A64] hover:text-[#121212] transition-colors rounded-full hover:bg-[#F4F0E8]"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-5 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D]">
                  Popular:
                </span>
                {SEARCH_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTag(tag)}
                    className="text-sm px-3.5 py-1.5 rounded-full border border-[#E8E4DC] text-[#121212] hover:border-[#C5A46D] hover:text-[#C5A46D] transition-all duration-200 cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm animate-fade-in lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-[360px] bg-[#FAF9F6] text-[#121212] z-[70] flex flex-col shadow-2xl border-r border-[#E8E4DC] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8E4DC] relative">
          {/* Gold accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C5A46D] via-[#E8D5B0] to-[#C5A46D]" />
          <div>
            <h2 className="font-display text-lg tracking-widest uppercase">WOMEN&apos;S WORLD</h2>
            <p className="text-[11px] tracking-widest uppercase text-[#C5A46D] font-semibold">Nashik Atelier</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-[#121212] hover:text-[#C5A46D] transition-colors rounded-full hover:bg-[#F4F0E8]"
            aria-label="Close"
          >
            <X className="h-5 w-5 stroke-[1.5]" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-1">
          {NAV.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center justify-between py-4 px-2 text-sm tracking-[0.1em] uppercase font-sans font-medium border-b border-[#E8E4DC]/60 hover:text-[#C5A46D] hover:border-[#C5A46D]/30 transition-all duration-200 group/mobile"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span>{link.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#6E6A64] group-hover/mobile:text-[#C5A46D] group-hover/mobile:translate-x-1 transition-all" />
            </Link>
          ))}

          <div className="pt-8 space-y-3">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello! I would like to inquire about your collections.")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full bg-[#121212] text-white font-semibold text-sm tracking-wider uppercase shadow-md hover:bg-[#25D366] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" /> Chat on WhatsApp
            </a>
          </div>
        </nav>

        <div className="p-6 border-t border-[#E8E4DC]">
          <div className="text-sm text-[#6E6A64]">
            <p className="font-medium text-[#121212]">Indira Nagar, Nashik</p>
            <p className="mt-0.5">Maharashtra 422009</p>
            <p className="mt-1 text-[#C5A46D] font-semibold">+91 98765 43210</p>
          </div>
        </div>
      </div>
    </>
  );
}
