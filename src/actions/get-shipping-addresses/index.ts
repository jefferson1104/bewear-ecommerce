"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippinAddressesTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getShippingAddresses = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const addresses = await db
      .select()
      .from(shippinAddressesTable)
      .where(eq(shippinAddressesTable.userId, session.user.id))
      .orderBy(shippinAddressesTable.createdAt);

    return addresses;
  } catch (error) {
    console.error("Error fetching shipping addresses:", error);
    throw new Error("Failed to fetch shipping addresses");
  }
};
