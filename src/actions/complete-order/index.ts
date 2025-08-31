"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import {
  cartItemsTable,
  cartsTable,
  orderItemsTable,
  ordersTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export const completeOrder = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartsTable.findFirst({
    where: eq(cartsTable.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (!cart.shippingAddress) {
    throw new Error("Shipping address not found");
  }

  const totalPriceInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );

  await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(ordersTable)
      .values({
        ...cart.shippingAddress!,
        userId: session.user.id!,
        totalPriceInCents,
        shippingAddressId: cart.shippingAddress!.id,
      })
      .returning();

    if (!order) {
      throw new Error("Failed to create order");
    }

    const orderItemsPayload: Array<typeof orderItemsTable.$inferInsert> =
      cart.items.map((item) => ({
        orderId: order.id,
        productVariantId: item.productVariant.id,
        quantity: item.quantity,
        priceInCents: item.productVariant.priceInCents,
      }));

    await tx.insert(orderItemsTable).values(orderItemsPayload);

    await tx.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));
  });
};
