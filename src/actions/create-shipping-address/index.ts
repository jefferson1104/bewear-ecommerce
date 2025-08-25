"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { shippinAddressesTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  CreateShippingAddressSchema,
  createShippingAddressSchema,
} from "./schema";

export const createShippingAddress = async (
  data: CreateShippingAddressSchema,
) => {
  // Validate input
  const parsed = createShippingAddressSchema.parse(data);

  // Validate session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [created] = await db
    .insert(shippinAddressesTable)
    .values({
      userId: session.user.id,
      recipientName: parsed.fullName,
      phone: parsed.phone,
      email: parsed.email,
      document: "", // not used in US flow
      street: parsed.address,
      number: parsed.number,
      complement: parsed.complement ?? null,
      neighborhood: parsed.neighborhood,
      city: parsed.city,
      state: parsed.state,
      zipCode: parsed.zipCode,
      country: parsed.country === "US" ? "United States" : "Brazil",
    })
    .returning();

  return created;
};
