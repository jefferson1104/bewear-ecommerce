import { MinusIcon, PlusIcon, Trash, TrashIcon } from "lucide-react";
import Image from "next/image";

import { formatCentsToCurrency } from "@/utils/currency";

import { Button } from "./ui/button";

interface ICartItemProps {
  id: string;
  productName: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

export function CartItem({
  id,
  productName,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity,
}: ICartItemProps) {
  // Renders
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg"
        />

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="tex-xs text-muted-foreground font-medium">
            {productVariantName}
          </p>

          <div className="flex w-26 items-center justify-between rounded-lg border p-1">
            <Button
              variant="ghost"
              className="h-4 w-4"
              // onClick={handleDecreaseQuantity}
            >
              <MinusIcon />
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button
              variant="ghost"
              className="h-4 w-4"
              // onClick={handleIncreaseQuantity}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center gap-1">
        <Button variant="outline" size="icon">
          <TrashIcon />
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToCurrency(productVariantPriceInCents * quantity)}
        </p>
      </div>
    </div>
  );
}
