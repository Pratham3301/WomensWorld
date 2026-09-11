import prisma from "@/lib/prisma";
import HomeContent from "@/components/HomeContent";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  
  try {
    products = await prisma.product.findMany({
      where: { isActive: true },
      include: { images: true, category: true, variants: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database connection failed during build:", error);
  }

  return <HomeContent products={products} />;
}
