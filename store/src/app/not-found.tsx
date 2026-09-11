import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-[#FAF9F6] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-[#C5A46D]/5 blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 rounded-full bg-[#B8697A]/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md">
        <p className="font-display text-[120px] sm:text-[160px] font-normal text-[#E8E4DC] leading-none select-none mb-[-30px]">
          404
        </p>
        <div className="ornament-divider mb-4 max-w-[80px] mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D] flex-shrink-0" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-[#121212] uppercase tracking-wide mb-3">
          Page Not Found
        </h1>
        <p className="text-[#6E6A64] text-sm mb-8 max-w-sm leading-relaxed font-light mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved to a new location.
        </p>
        <Link
          href="/"
          className="btn-magnetic inline-flex items-center gap-2.5 bg-[#121212] text-white px-8 py-4 rounded-full text-xs font-semibold tracking-wider uppercase hover:bg-[#C5A46D] transition-colors duration-300 shadow-md"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
