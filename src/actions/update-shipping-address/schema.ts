import { z } from "zod";

export const updateShippingAddressSchema = z.object({
  shippingAddressId: z.uuid(),
});

export type UpdateShippingAddressSchema = z.infer<
  typeof updateShippingAddressSchema
>;
