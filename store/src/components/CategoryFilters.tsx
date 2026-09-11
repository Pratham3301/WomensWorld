'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export default function CategoryFilters({
  slug,
  currentSort,
  currentQuery,
}: {
  slug: string;
  currentSort: string;
  currentQuery?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentMin = searchParams.get('min') || '';
  const currentMax = searchParams.get('max') || '';

  const [isOpen, setIsOpen] = useState(false);
  const [min, setMin] = useState(currentMin);
  const [max, setMax] = useState(currentMax);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (currentSort && currentSort !== 'newest') params.set('sort', currentSort);
    if (currentQuery) params.set('q', currentQuery);
    if (min) params.set('min', min);
    if (max) params.set('max', max);
    
    router.push(`/category/${slug}?${params.toString()}`);
    setIsOpen(false);
  }, [currentSort, currentQuery, min, max, router, slug]);

  const clearFilters = useCallback(() => {
    setMin('');
    setMax('');
    const params = new URLSearchParams();
    if (currentSort && currentSort !== 'newest') params.set('sort', currentSort);
    if (currentQuery) params.set('q', currentQuery);
    router.push(`/category/${slug}?${params.toString()}`);
    setIsOpen(false);
  }, [currentSort, currentQuery, router, slug]);

  const activeFiltersCount = (currentMin ? 1 : 0) + (currentMax ? 1 : 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-sans font-semibold text-sm tracking-wider uppercase transition-all duration-300 ${
          activeFiltersCount > 0
            ? 'bg-[#121212] text-white shadow-md border-transparent'
            : 'bg-white text-[#121212] border border-[#E8E4DC] hover:border-[#C5A46D]'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-3 w-screen max-w-[320px] bg-white rounded-2xl shadow-2xl border border-[#E8E4DC] z-50 overflow-hidden transform origin-top-left animate-slide-down sm:w-[320px] -left-4 sm:left-0">
            <div className="flex items-center justify-between p-4 border-b border-[#E8E4DC] bg-[#FAF9F6]">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#121212]">
                Filters
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#6E6A64] hover:text-[#121212] rounded-full hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#6E6A64] mb-3">
                Price Range (₹)
              </h4>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E8E4DC] rounded-lg text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D] transition-colors placeholder:text-[#6E6A64]/50"
                />
                <span className="text-[#6E6A64]">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E8E4DC] rounded-lg text-sm text-[#121212] focus:outline-none focus:border-[#C5A46D] transition-colors placeholder:text-[#6E6A64]/50"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#E8E4DC] bg-[#FAF9F6] flex items-center justify-between gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 text-xs font-sans font-semibold tracking-wider uppercase text-[#6E6A64] hover:text-[#121212] transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-2.5 bg-[#121212] hover:bg-[#C5A46D] text-white rounded-lg text-xs font-sans font-semibold tracking-wider uppercase transition-colors shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
