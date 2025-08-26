"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";

interface IProductActionProps {
  productVariantId: string;
}

export function ProductActions({ productVariantId }: IProductActionProps) {
  // Hooks
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useQueryState(
    "quantity",
    parseAsInteger.withDefault(1),
  );
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-product-to-cart", productVariantId, quantity],
    mutationFn: () => addProductToCart({ productVariantId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Methods
  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) =>
      prevQuantity > 1 ? prevQuantity - 1 : prevQuantity,
    );
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Renders
  return (
    <>
      <div className="px-5">
        <div className="space-y-4">
          <h3 className="font-medium">Quantity</h3>
          <div className="flex w-26 items-center justify-between rounded-lg border">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecreaseQuantity}
            >
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncreaseQuantity}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 px-5">
        <Button
          className="rounded-full"
          size="lg"
          variant="outline"
          disabled={isPending}
          isLoading={isPending}
          onClick={() => mutate()}
        >
          Add to cart
        </Button>

        <Button className="rounded-full" size="lg">
          Buy now
        </Button>
      </div>
    </>
  );
}
