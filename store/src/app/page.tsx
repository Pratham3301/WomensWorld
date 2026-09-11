import prisma from "@/lib/prisma";
import HomeContent from "@/components/HomeContent";

export const revalidate = 60; // 1 minute cache for instant loads

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: true, category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return <HomeContent products={products} />;
}
