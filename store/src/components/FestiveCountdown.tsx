"use client";

import { useState, useEffect } from "react";

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-[#181411]/80 backdrop-blur-md rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border border-[#C5A880]/50 shadow-2xl mb-2">
      <span className="font-cinzel text-2xl sm:text-3xl font-bold text-[#C5A880]">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span className="text-white/80 text-[10px] sm:text-xs font-cinzel font-semibold uppercase tracking-widest">
      {label}
    </span>
  </div>
);

export default function FestiveCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 20 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) return null;

  return (
    <div className="flex gap-3 sm:gap-6 justify-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}
