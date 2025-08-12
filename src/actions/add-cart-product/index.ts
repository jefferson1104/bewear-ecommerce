"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemsTable, cartsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  // Data validation
  addProductToCartSchema.parse(data);

  // Session validation
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Check if the productVariant exists
  const productVariant = await db.query.productVariantsTable.findFirst({
    where: (productVariant, { eq }) =>
      eq(productVariant.id, data.productVariantId),
  });

  if (!productVariant) {
    throw new Error("Product variant not found");
  }

  // Check if the cart exists
  const cart = await db.query.cartsTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  let cartId = cart?.id;

  // If cart does not exist, create it
  if (!cartId) {
    const [newCart] = await db
      .insert(cartsTable)
      .values({
        userId: session.user.id,
      })
      .returning();

    cartId = newCart.id;
  }

  // Check if the cart item exists
  const cartItem = await db.query.cartItemsTable.findFirst({
    where: (cartItem, { eq }) =>
      eq(cartItem.cartId, cartId) &&
      eq(cartItem.productVariantId, data.productVariantId),
  });

  // If the cart item exists, update the quantity
  if (cartItem) {
    await db
      .update(cartItemsTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemsTable.id, cartItem.id));
    return;
  }

  // If cart item does not exist, create item
  await db.insert(cartItemsTable).values({
    cartId,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  });
};
