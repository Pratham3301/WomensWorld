import Link from 'next/link';
import { MapPin, Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import NewsletterForm from './NewsletterForm';
import { WHATSAPP_PHONE } from './WhatsAppWidget';

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Decorative gold gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A46D]/40 to-transparent" />

      {/* Newsletter Header */}
      <div className="border-b border-white/8 relative">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5A46D]/3 to-transparent" />

        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-14 lg:py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="ornament-divider mb-3 max-w-[100px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D] flex-shrink-0" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-wide mb-3">
                Join the Women&apos;s World Newsletter
              </h3>
              <p className="text-white/50 text-sm sm:text-base font-light max-w-md leading-relaxed">
                Subscribe for private sale access, new seasonal drops, and styling recommendations from our Nashik atelier.
              </p>
            </div>
            <div className="lg:max-w-md lg:ml-auto w-full">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-xl uppercase tracking-widest text-white">
                Women&apos;s World
              </h2>
              <p className="text-xs tracking-[0.3em] uppercase text-[#C5A46D] font-semibold mt-0.5">Nashik Atelier</p>
            </div>
            <p className="text-white/50 text-sm leading-relaxed font-light">
              Nashik boutique specializing in curated Indian ethnic wear, occasion lehengas, and contemporary kids fashion.
            </p>
            <div className="flex gap-2.5 pt-1">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-[#C5A46D] text-white/60 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-[#C5A46D] text-white/60 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-sans font-bold text-xs tracking-[0.16em] uppercase text-[#C5A46D] mb-6">
              Categories
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Anarkalis & Suits", href: '/category/women' },
                { name: 'Bridal Lehengas', href: '/category/occasion-wear' },
                { name: 'Daily Cotton Kurtas', href: '/category/women' },
                { name: "Kids' Collection", href: '/category/kids' },
                { name: 'Designer Sarees', href: '/category/occasion-wear' },
                { name: 'Festive Shop', href: '/festive' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/50 hover:text-[#C5A46D] transition-colors duration-200 flex items-center gap-1 group/link"
                  >
                    <span className="w-0 group-hover/link:w-3 overflow-hidden transition-all duration-200">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="font-sans font-bold text-xs tracking-[0.16em] uppercase text-[#C5A46D] mb-6">
              Customer Service
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'WhatsApp Concierge', href: `https://wa.me/${WHATSAPP_PHONE}` },
                { name: 'Custom Sizing & Alterations', href: '/category/women' },
                { name: 'Shipping & Delivery', href: '/' },
                { name: '7-Day Return Policy', href: '/' },
                { name: 'Track Order', href: '/' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-xs text-white/50 hover:text-[#C5A46D] transition-colors duration-200 flex items-center gap-1 group/link"
                  >
                    <span className="w-0 group-hover/link:w-3 overflow-hidden transition-all duration-200">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans font-bold text-xs tracking-[0.16em] uppercase text-[#C5A46D] mb-6">
              Store Location
            </h4>
            <div className="space-y-4 text-sm text-white/60 font-light">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A46D]" />
                </div>
                <span className="pt-1.5">
                  Women&apos;s World<br />
                  Indira Nagar, Near City Center<br />
                  Nashik, Maharashtra 422009
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Phone className="w-3.5 h-3.5 text-[#C5A46D]" />
                </div>
                <a href="tel:+919876543210" className="hover:text-[#C5A46D] transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Mail className="w-3.5 h-3.5 text-[#C5A46D]" />
                </div>
                <a href="mailto:care@womensworld.com" className="hover:text-[#C5A46D] transition-colors">
                  care@womensworld.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 font-light text-center sm:text-left">
            &copy; {new Date().getFullYear()} Women&apos;s World Boutique &bull; Handcrafted in Nashik with &#10084;
          </p>
          <div className="flex items-center gap-5 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#C5A46D]/50" />
              UPI Instant
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#C5A46D]/50" />
              Visa / Mastercard
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#C5A46D]/50" />
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
