'use client';

import { useCartStore } from "@/lib/store";
import { useEffect, useState, useRef } from "react";

export default function CartBadge() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);
  const prevCount = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = items.reduce((total, item) => total + (item.quantity || 1), 0);

  // Trigger bounce animation when count changes
  useEffect(() => {
    if (mounted && count > prevCount.current) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 400);
      prevCount.current = count;
      return () => clearTimeout(timer);
    }
    prevCount.current = count;
  }, [count, mounted]);

  if (!mounted) return null;
  if (count <= 0) return null;

  return (
    <span
      className={`absolute -top-1 -right-1 flex h-[18px] min-w-[18px] px-[5px] items-center justify-center rounded-full bg-[#C5A46D] text-[10px] font-bold text-white shadow-md border-2 border-[#FAF9F6] transition-transform duration-300 ${
        animate ? 'scale-125' : 'scale-100'
      }`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
