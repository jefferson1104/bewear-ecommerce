import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Addresses } from "@/components/addresses";
import { Header } from "@/components/header";
import { db } from "@/db";
import { shippinAddressesTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function IdentificationPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const cart = await db.query.cartsTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  // Utils
  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  const shippingAddresses = await db.query.shippinAddressesTable.findMany({
    where: eq(shippinAddressesTable.userId, session.user.id),
  });

  // Renders
  return (
    <>
      <Header />
      <div className="px-5">
        <Addresses
          shippingAddresses={shippingAddresses}
          defaultShippingAddressId={cart.shippingAddress?.id || null}
        />
      </div>
    </>
  );
}
