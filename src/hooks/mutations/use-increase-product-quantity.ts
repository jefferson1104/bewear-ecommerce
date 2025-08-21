import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";

import { getUseCartQueryKey } from "../queries/use-get-cart";

export const getIncreaseProductQuantityMutationKey = (
  productVariantId: string,
) => ["increase-cart-product-quantity", productVariantId] as const;

export const useIncreaseProductQuantity = (productVariantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getIncreaseProductQuantityMutationKey(productVariantId),
    mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
