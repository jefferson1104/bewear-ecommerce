"use client";
import { MinusIcon, PlusIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { Button } from "./ui/button";

export function QuantitySelector() {
  // States
  const [quantity, setQuantity] = useQueryState(
    "quantity",
    parseAsInteger.withDefault(1),
  );

  // Methods
  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) =>
      prevQuantity > 1 ? prevQuantity - 1 : prevQuantity,
    );
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Renders
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quantity</h3>
      <div className="flex w-26 items-center justify-between rounded-lg border">
        <Button variant="ghost" size="icon" onClick={handleDecreaseQuantity}>
          <MinusIcon />
        </Button>
        <p>{quantity}</p>
        <Button variant="ghost" size="icon" onClick={handleIncreaseQuantity}>
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
