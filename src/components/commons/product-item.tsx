"use client";

import Image from "next/image";
import Link from "next/link";

import { productsTable, productVariantsTable } from "@/db/schema";
import { formatCentsToCurrency } from "@/utils/currency";

interface IProductItemProps {
  product: typeof productsTable.$inferSelect & {
    variants: (typeof productVariantsTable.$inferSelect)[];
  };
}

export function ProductItem({ product }: IProductItemProps) {
  // Constants
  const firstVariant = product.variants[0];

  // Renders
  return (
    <Link href="/" className="flex flex-col gap-4">
      <Image
        src={firstVariant.imageUrls[0]}
        alt={firstVariant.name}
        width={250}
        height={250}
        className="rounded-3xl"
      />
      <div className="flex flex-col gap-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground max-w-[250px] truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold">
          {formatCentsToCurrency(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
}
