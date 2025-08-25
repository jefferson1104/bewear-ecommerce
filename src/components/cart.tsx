"use client";

import { LoaderCircleIcon, ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";

import { useGetCart } from "@/hooks/queries/use-get-cart";
import { formatCentsToCurrency } from "@/utils/currency";

import { CartItem } from "./cart-item";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export function Cart() {
  // Hooks
  const { data: cart, isPending: cartIsLoading } = useGetCart();

  // Constants
  const isCartEmpty = !cart || cart.items.length === 0;

  // Renders
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[320px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col px-5 pb-5">
          <div className="flex h-full max-h-full flex-col overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col gap-8">
                {cartIsLoading && (
                  <div className="flex items-center justify-center gap-2">
                    <LoaderCircleIcon className="animate-spin" />
                    <p className="text-sm font-semibold">Loading...</p>
                  </div>
                )}

                {!cartIsLoading && isCartEmpty && (
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-sm font-semibold">Your cart is empty</p>
                  </div>
                )}

                {!isCartEmpty &&
                  !cartIsLoading &&
                  cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productName={item.productVariant.product.name}
                      productVariantId={item.productVariant.id}
                      productVariantName={item.productVariant.name}
                      productVariantImageUrl={item.productVariant.imageUrls[0]}
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
                      quantity={item.quantity}
                    />
                  ))}
              </div>
            </ScrollArea>
          </div>

          {cart?.items && cart.items.length > 0 && (
            <div className="flex flex-col gap-4">
              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Subtotal</p>
                <p>{formatCentsToCurrency(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Shipping</p>
                <p>FREE</p>
              </div>

              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p>Total</p>
                <p>{formatCentsToCurrency(cart?.totalPriceInCents ?? 0)}</p>
              </div>

              <Button className="mt-5 rounded-full" asChild>
                <Link href="/cart/identification">Checkout</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
