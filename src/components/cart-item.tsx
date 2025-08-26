import { Loader2Icon, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { useDecreaseProductQuantity } from "@/hooks/mutations/use-decrease-product-quantity";
import { useIncreaseProductQuantity } from "@/hooks/mutations/use-increase-product-quantity";
import { useRemoveProduct } from "@/hooks/mutations/use-remove-product";
import { formatCentsToCurrency } from "@/utils/currency";

import { Button } from "./ui/button";

interface ICartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

export function CartItem({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity,
}: ICartItemProps) {
  // Hooks
  const removeProduct = useRemoveProduct(id);
  const decreaseProductQuantity = useDecreaseProductQuantity(id);
  const increaseProductQuantity = useIncreaseProductQuantity(productVariantId);

  // Constants
  const isLoading =
    decreaseProductQuantity.isPending ||
    increaseProductQuantity.isPending ||
    removeProduct.isPending;

  // Methods
  const handleDeleteProductFromCart = () => {
    removeProduct.mutate(undefined, {
      onSuccess: () => {
        toast.success("Product removed from cart successfully");
      },
      onError: (error) => {
        console.error("Error removing product from cart:", error);
        toast.error("Failed to remove product from cart");
      },
    });
  };

  const handleDecreaseProductQuantity = () => {
    decreaseProductQuantity.mutate(undefined, {
      onSuccess: () => {
        toast.success("Product quantity decreased successfully");
      },
      onError: (error) => {
        console.error("Error decreasing product quantity:", error);
        toast.error("Failed to decrease product quantity");
      },
    });
  };

  const handleIncreaseProductQuantity = () => {
    increaseProductQuantity.mutate(undefined, {
      onSuccess: () => {
        toast.success("Product quantity increased successfully");
      },
      onError: (error) => {
        console.error("Error increasing product quantity:", error);
        toast.error("Failed to increase product quantity");
      },
    });
  };

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
              onClick={handleDecreaseProductQuantity}
              disabled={isLoading}
            >
              <MinusIcon />
            </Button>
            <p className="text-xs font-medium">
              {isLoading ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                quantity
              )}
            </p>
            <Button
              variant="ghost"
              className="h-4 w-4"
              onClick={handleIncreaseProductQuantity}
              disabled={isLoading}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDeleteProductFromCart}
          disabled={isLoading}
          isLoading={isLoading}
        >
          <TrashIcon />
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToCurrency(productVariantPriceInCents * quantity)}
        </p>
      </div>
    </div>
  );
}
