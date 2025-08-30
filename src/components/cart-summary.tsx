import Image from "next/image";

import { formatCentsToCurrency } from "@/utils/currency";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface CartProduct {
  id: string;
  name: string;
  variantName: string;
  quantity: number;
  priceInCents: number;
  imageUrl: string;
}

interface ICartSummaryProps {
  subtotalInCents: number;
  totalInCents: number;
  products: CartProduct[];
}

export function CartSummary({
  subtotalInCents,
  totalInCents,
  products,
}: ICartSummaryProps) {
  // Renders
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <p className="text-sm">Subtotal</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToCurrency(subtotalInCents)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Shipping</p>
          <p className="text-muted-foreground text-sm font-medium">FREE</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Total</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToCurrency(totalInCents)}
          </p>
        </div>

        <div className="py-3">
          <Separator />
        </div>

        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={product.imageUrl}
                alt={product.variantName}
                width={78}
                height={78}
                className="rounded-lg"
              />

              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="tex-xs text-muted-foreground font-medium">
                  {product.variantName}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end justify-center gap-1">
              <p className="text-sm font-bold">
                {formatCentsToCurrency(product.priceInCents * product.quantity)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
