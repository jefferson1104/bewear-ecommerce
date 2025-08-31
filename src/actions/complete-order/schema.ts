import z from "zod";

export const completeOrderSchema = z.object({
  shippingAddressId: z.uuid(),
  items: z.array(
    z.object({
      productVariantId: z.uuid(),
      quantity: z.number().min(1),
    }),
  ),
});

export type CompleteOrderSchema = z.infer<typeof completeOrderSchema>;
