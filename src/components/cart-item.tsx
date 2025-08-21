import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2Icon,
  MinusIcon,
  PlusIcon,
  Trash,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { decreaseCartProductQuantity } from "@/actions/decrease-cart-product-quantity";
import { removeProductFromCart } from "@/actions/remove-cart-product";
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
  // Hooks
  const queryClient = useQueryClient();
  const removeProductFromCartMutation = useMutation({
    mutationKey: ["remove-cart-product"],
    mutationFn: () => removeProductFromCart({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const decreaseCartProductQuantityMutation = useMutation({
    mutationKey: ["decrease-cart-product-quantity"],
    mutationFn: () => decreaseCartProductQuantity({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Constants
  const isLoadingToChangeQuantity =
    decreaseCartProductQuantityMutation.isPending;

  // Methods
  const handleDeleteProductFromCart = () => {
    removeProductFromCartMutation.mutate(undefined, {
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
    decreaseCartProductQuantityMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Product quantity decreased successfully");
      },
      onError: (error) => {
        console.error("Error decreasing product quantity:", error);
        toast.error("Failed to decrease product quantity");
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
              disabled={isLoadingToChangeQuantity}
            >
              <MinusIcon />
            </Button>
            <p className="text-xs font-medium">
              {isLoadingToChangeQuantity ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                quantity
              )}
            </p>
            <Button
              variant="ghost"
              className="h-4 w-4"
              // onClick={handleIncreaseQuantity}
              disabled={isLoadingToChangeQuantity}
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
          disabled={removeProductFromCartMutation.isPending}
        >
          {removeProductFromCartMutation.isPending ? (
            <Loader2Icon className="mr-1 animate-spin" />
          ) : (
            <TrashIcon />
          )}
        </Button>
        <p className="text-sm font-bold">
          {formatCentsToCurrency(productVariantPriceInCents * quantity)}
        </p>
      </div>
    </div>
  );
}
