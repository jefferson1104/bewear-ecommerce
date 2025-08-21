"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  DecreaseCartProductQuantitySchema,
  decreaseCartProductQuantitySchema,
} from "./schema";

export const decreaseCartProductQuantity = async (
  data: DecreaseCartProductQuantitySchema,
) => {
  // Data validation
  decreaseCartProductQuantitySchema.parse(data);

  // Session validation
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Check if the cart item exists
  const cartItem = await db.query.cartItemsTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });

  // If the cart item does not exist throw an error
  if (!cartItem) {
    throw new Error("Product variant not found in cart");
  }

  // Check if the cart item belongs to the user
  const cartDoesNotBelongsToTheUser = cartItem.cart.userId !== session.user.id;
  if (cartDoesNotBelongsToTheUser) {
    throw new Error("Unauthorized");
  }

  // If the cart item quantity is 1, remove it from the cart
  if (cartItem.quantity === 1) {
    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, cartItem.id));
    return;
  }

  // Decrease the cart item quantity
  await db
    .update(cartItemsTable)
    .set({ quantity: cartItem.quantity - 1 })
    .where(eq(cartItemsTable.id, cartItem.id));
};
