import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateShippingAddress } from "@/actions/update-shipping-address";
import { UpdateShippingAddressSchema } from "@/actions/update-shipping-address/schema";

import { getUseCartQueryKey } from "../queries/use-get-cart";

export const getUpdateShippingAddressMutationKey = () => [
  "update-shipping-address",
];

export const useUpdateShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUpdateShippingAddressMutationKey(),
    mutationFn: (data: UpdateShippingAddressSchema) =>
      updateShippingAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
