import { desc } from "drizzle-orm";
import Image from "next/image";

import { Header } from "@/components//header";
import { ProductList } from "@/components//product-list";
import { CategorySelector } from "@/components/category-selector";
import { Footer } from "@/components/footer";
import { db } from "@/db";
import { productsTable } from "@/db/schema";

export default async function HomePage() {
  // Constants
  const categories = await db.query.categoriesTable.findMany();

  const products = await db.query.productsTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreatedProducts = await db.query.productsTable.findMany({
    orderBy: [desc(productsTable.createdAt)],
    with: {
      variants: true,
    },
  });

  // Renders
  return (
    <main className="space-y-6">
      <Header />

      <div className="px-5">
        <Image
          src="/images/home-banner-01.png"
          alt="Leve uma vida com estilo"
          height={0}
          width={0}
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>

      <ProductList title="Best sellers" products={products} />

      <div className="px-5">
        <CategorySelector categories={categories} />
      </div>

      <div className="px-5">
        <Image
          src="/images/home-banner-02.png"
          alt="Seja autêntico"
          height={0}
          width={0}
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>

      <ProductList title="New arrivals" products={newlyCreatedProducts} />

      <Footer />
    </main>
  );
}
