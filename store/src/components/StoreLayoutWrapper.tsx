"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export default function StoreLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1 w-full">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full pt-[96px] md:pt-[104px]">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
