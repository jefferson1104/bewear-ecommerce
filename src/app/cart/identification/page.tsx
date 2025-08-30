import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Addresses } from "@/components/addresses";
import { CartSummary } from "@/components/cart-summary";
import { Footer } from "@/components/footer";
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

  const cartTotalInCents = cart.items.reduce(
    (total, item) => total + item.productVariant.priceInCents * item.quantity,
    0,
  );

  const shippingAddresses = await db.query.shippinAddressesTable.findMany({
    where: eq(shippinAddressesTable.userId, session.user.id),
  });

  // Renders
  return (
    <div className="space-y-4">
      <Header hideCart hideMenu showBackButton />

      <div className="mb-12 space-y-4 px-5">
        <Addresses
          shippingAddresses={shippingAddresses}
          defaultShippingAddressId={cart.shippingAddress?.id || null}
        />
        <CartSummary
          totalInCents={cartTotalInCents}
          subtotalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrls[0],
          }))}
        />
      </div>

      <Footer />
    </div>
  );
}
