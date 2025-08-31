import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { CartSummary } from "@/components/cart-summary";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { formatAddress } from "@/utils/address-utils";

export default async function ConfirmationPage() {
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

  // Renders
  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }
  return (
    <div>
      <Header showBackButton hideCart hideMenu />

      <div className="space-y-4 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardContent>
                <p className="text-sm">{formatAddress(cart.shippingAddress)}</p>
              </CardContent>
            </Card>

            <Button className="w-full rounded-full" size="lg">
              Checkout now
            </Button>
          </CardContent>
        </Card>

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

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}
