import type { Metadata } from "next";
import "./globals.css";
import StoreLayoutWrapper from "@/components/StoreLayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Women's World | Handcrafted Fashion & Festive Wear",
    template: "%s | Women's World Atelier",
  },
  description:
    "Curated Indian ethnic wear, festive lehengas, cotton kurtis, and kids fashion from Nashik boutique. Order via WhatsApp for custom sizing.",
  openGraph: {
    title: "Women's World | Handcrafted Fashion",
    description: "Curated Indian ethnic wear, festive lehengas, and kids fashion from Nashik boutique.",
    url: '/',
    siteName: "Women's World",
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Women's World",
    description: "Curated Indian ethnic wear and festive fashion.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-[#121212] font-sans antialiased">
        <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
      </body>
    </html>
  );
}
