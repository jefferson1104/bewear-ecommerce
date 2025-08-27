"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  UpdateShippingAddressSchema,
  updateShippingAddressSchema,
} from "./schema";

export const updateShippingAddress = async (
  data: UpdateShippingAddressSchema,
) => {
  updateShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const shippingAddress = await db.query.shippinAddressesTable.findFirst({
    where: (shippingAddress, { eq, and }) =>
      and(
        eq(shippingAddress.id, data.shippingAddressId),
        eq(shippingAddress.userId, session.user.id),
      ),
  });

  if (!shippingAddress) {
    throw new Error("Shipping address not found or unauthorized");
  }

  const cart = await db.query.cartsTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  await db
    .update(cartsTable)
    .set({
      shippingAddressId: data.shippingAddressId,
    })
    .where(eq(cartsTable.id, cart.id));

  return { success: true };
};
