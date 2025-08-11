"use client";

import Image from "next/image";
import Link from "next/link";

import { productsTable, productVariantsTable } from "@/db/schema";
import { formatCentsToCurrency } from "@/utils/currency";
import { cn } from "@/utils/tailwind-utils";

interface IProductItemProps {
  product: typeof productsTable.$inferSelect & {
    variants: (typeof productVariantsTable.$inferSelect)[];
  };
  textContainerClassName?: string;
}

export function ProductItem({
  product,
  textContainerClassName,
}: IProductItemProps) {
  // Constants
  const firstVariant = product.variants[0];

  // Renders
  return (
    <Link
      href={`/product-variant/${firstVariant.slug}`}
      className="flex flex-col gap-4"
    >
      <Image
        src={firstVariant.imageUrls[0]}
        alt={firstVariant.name}
        width={0}
        height={0}
        sizes="100vw"
        className="h-auto w-full rounded-3xl"
      />
      <div
        className={cn(
          "flex max-w-[250px] flex-col gap-1",
          textContainerClassName,
        )}
      >
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold">
          {formatCentsToCurrency(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
}
