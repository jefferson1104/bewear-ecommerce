"use client";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon, ShoppingBasketIcon } from "lucide-react";
import Image from "next/image";

import { getCart } from "@/actions/get-cart";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export function Cart() {
  // Hooks
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  // Renders
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>

        <div>
          {cartIsLoading && (
            <div className="flex items-center justify-center gap-2">
              <LoaderCircleIcon className="animate-spin" />
              <p className="text-sm font-semibold">Loading...</p>
            </div>
          )}

          {cart?.items.map((item) => (
            <div key={item.id}>
              <Image
                src={item.productVariant.imageUrls[0]}
                alt={item.productVariant.product.name}
                width={100}
                height={100}
                className="rounded-3xl"
              />

              <div>
                <h3>{item.productVariant.product.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
