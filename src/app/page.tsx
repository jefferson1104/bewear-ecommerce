import Image from "next/image";

import { Header } from "@/components//header";
import { ProductList } from "@/components//product-list";
import { db } from "@/db";

export default async function HomePage() {
  // Constants
  const products = await db.query.productsTable.findMany({
    with: {
      variants: true,
    },
  });

  // Renders
  return (
    <>
      <Header />

      <div className="space-y-6">
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

        <ProductList title="Mais vendidos" products={products} />

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
      </div>
    </>
  );
}
