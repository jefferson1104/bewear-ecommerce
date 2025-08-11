import Image from "next/image";
import Link from "next/link";

import { productVariantsTable } from "@/db/schema";

interface IVariantSelectorProps {
  selectedVariant: string;
  variants: (typeof productVariantsTable.$inferSelect)[];
}

export function VariantSelector({
  variants,
  selectedVariant,
}: IVariantSelectorProps) {
  // Renders
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Link
          href={`/product-variant/${variant.slug}`}
          key={variant.id}
          className={
            selectedVariant === variant.slug
              ? "border-primary rounded-xl border-2"
              : ""
          }
        >
          <Image
            width={68}
            height={68}
            src={variant.imageUrls[0]}
            alt={variant.name}
            className="rounded-xl"
          />
        </Link>
      ))}
    </div>
  );
}
