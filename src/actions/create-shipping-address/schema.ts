import z from "zod";

export const createShippingAddressSchema = z.object({
  email: z.email().trim(),
  fullName: z.string().trim().min(1),
  country: z.enum(["US", "BR"]).default("US"),
  phone: z.string().trim().min(1),
  zipCode: z.string().trim().min(5),
  address: z.string().trim().min(1),
  number: z.string().trim().min(1),
  complement: z.string().trim().optional().nullable(),
  neighborhood: z.string().trim().min(1),
  city: z.string().trim().min(1),
  state: z.string().trim().min(2).max(2),
});

export type CreateShippingAddressSchema = z.infer<
  typeof createShippingAddressSchema
>;
