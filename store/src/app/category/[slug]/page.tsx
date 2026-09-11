import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryFilters from "@/components/CategoryFilters";
import { ChevronRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  if (slug === 'all') {
    return {
      title: "All Products | Women's World",
      description: "Browse our complete collection of handcrafted Indian ethnic wear, festive lehengas, and cotton kurtis.",
    };
  }

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const imageUrl = '/placeholder.png'; // Categories don't have images in schema yet

  return {
    title: `${category.name} | Women's World`,
    description: `Browse our exclusive collection of ${category.name} at Women's World.`,
    openGraph: {
      title: `${category.name} | Women's World`,
      description: `Browse our exclusive collection of ${category.name}.`,
      images: [{ url: imageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: category.name,
      description: `Browse our exclusive collection of ${category.name}.`,
      images: [imageUrl],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sort?: string; q?: string; min?: string; max?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const sort = sp?.sort ?? "newest";
  const query = sp?.q?.trim();

  const min = sp?.min ? parseFloat(sp.min as string) : undefined;
  const max = sp?.max ? parseFloat(sp.max as string) : undefined;

  const productWhere: any = { isActive: true };
  
  if (query || min !== undefined || max !== undefined) {
    productWhere.AND = [];

    if (query) {
      productWhere.AND.push({
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      });
    }

    if (min !== undefined || max !== undefined) {
      productWhere.AND.push({
        OR: [
          {
            discountPrice: {
              not: null,
              gte: min ?? 0,
              lte: max ?? 9999999,
            },
          },
          {
            discountPrice: null,
            price: {
              gte: min ?? 0,
              lte: max ?? 9999999,
            },
          },
        ],
      });
    }
  }

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: productWhere,
        include: { images: true, category: true, variants: true },
        orderBy:
          sort === "price-asc"
            ? { price: "asc" }
            : sort === "price-desc"
            ? { price: "desc" }
            : { createdAt: "desc" },
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-4 pb-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 max-w-[1440px] w-full">
        {/* Breadcrumb & Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-xs font-sans text-[#6E6A64] mb-4">
            <Link href="/" className="hover:text-[#C5A46D] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#121212] font-semibold">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E4DC]">
            <div>
              <div className="ornament-divider mb-2 max-w-[80px]">
                <Sparkles className="w-3 h-3 text-[#C5A46D] flex-shrink-0" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#121212] uppercase tracking-wide mb-1.5">
                {category.name}
              </h1>
              <p className="text-xs text-[#6E6A64] font-sans font-light">
                Showing {category.products.length} curated pieces
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-4">
              <CategoryFilters slug={slug} currentSort={sort} currentQuery={query} />
              
              <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#E8E4DC] pt-4 sm:pt-0 sm:pl-4">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#121212] flex items-center gap-1.5 whitespace-nowrap">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A46D]" /> Sort:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { value: "newest", label: "New In" },
                  { value: "price-asc", label: "Price: Low" },
                  { value: "price-desc", label: "Price: High" },
                ].map((opt) => (
                  <Link
                    key={opt.value}
                    href={`/category/${slug}?sort=${opt.value}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                    className={`text-[11px] px-4 py-2 rounded-full font-sans font-semibold tracking-wider whitespace-nowrap transition-all duration-300 ${
                      sort === opt.value
                        ? "bg-[#121212] text-white shadow-md"
                        : "bg-white text-[#6E6A64] border border-[#E8E4DC] hover:border-[#C5A46D] hover:text-[#C5A46D]"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {category.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-2xl border border-[#E8E4DC] p-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[30%] left-[20%] w-32 h-32 rounded-full bg-[#C5A46D]/5 blur-3xl" />
            </div>
            <h2 className="font-display text-xl text-[#121212] uppercase tracking-wide mb-2 relative">No Items Found</h2>
            <p className="text-xs font-sans text-[#6E6A64] mb-6 font-light max-w-sm relative">
              We couldn&apos;t find any items matching your search.
            </p>
            <Link
              href="/"
              className="btn-magnetic px-8 py-3.5 bg-[#121212] text-white font-sans font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-[#C5A46D] transition-colors duration-300 shadow-md relative"
            >
              Return Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {category.products.map((product, i) => (
              <div
                key={product.id}
                className="animate-reveal opacity-0"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
