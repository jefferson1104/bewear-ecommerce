import { useQuery } from "@tanstack/react-query";

import { getShippingAddresses } from "@/actions/get-shipping-addresses";
import { shippinAddressesTable } from "@/db/schema";

export const getShippingAddressesQueryKey = () => ["user-addresses"] as const;

export const useGetShippingAddresses = (params?: {
  initialData?: (typeof shippinAddressesTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getShippingAddressesQueryKey(),
    queryFn: getShippingAddresses,
    initialData: params?.initialData,
  });
};
