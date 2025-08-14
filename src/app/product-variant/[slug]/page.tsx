import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "path";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductActions } from "@/components/product-actions";
import { ProductList } from "@/components/product-list";
import { QuantitySelector } from "@/components/quantity-selector";
import { Button } from "@/components/ui/button";
import { VariantSelector } from "@/components/variant-selector";
import { db } from "@/db";
import { productsTable, productVariantsTable } from "@/db/schema";
import { formatCentsToCurrency } from "@/utils/currency";

interface IProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductVariantPage({
  params,
}: IProductVariantPageProps) {
  // Hooks

  // Constantes
  const { slug } = await params;
  const productVariant = await db.query.productVariantsTable.findFirst({
    where: eq(productVariantsTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });

  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await db.query.productsTable.findMany({
    where: eq(productsTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });

  // Renders
  return (
    <>
      <Header />

      <div className="flex flex-col space-y-6">
        <div className="px-5">
          <Image
            src={productVariant.imageUrls[0]}
            alt={productVariant.name}
            width={0}
            height={0}
            sizes="100vw"
            className="h-auto w-full rounded-3xl object-cover"
          />
        </div>

        <div className="px-5">
          <VariantSelector
            variants={productVariant.product.variants}
            selectedVariant={productVariant.slug}
          />
        </div>

        <div className="px-5">
          <h2 className="text-lg font-semibold">
            {productVariant.product.name}
          </h2>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToCurrency(productVariant.priceInCents)}
          </h3>
        </div>

        <ProductActions productVariantId={productVariant.id} />

        <div className="px-5">
          <p className="text-sm">{productVariant.product.description}</p>
        </div>

        <ProductList title="You may also like" products={likelyProducts} />

        <Footer />
      </div>
    </>
  );
}
