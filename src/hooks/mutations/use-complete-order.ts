import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeOrder } from "@/actions/complete-order";

import { getUseCartQueryKey } from "../queries/use-get-cart";

export const getCompleteOrderMutationKey = () => ["complete-order"] as const;

export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getCompleteOrderMutationKey(),
    mutationFn: completeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseCartQueryKey(),
      });
    },
  });
};
