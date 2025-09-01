"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCompleteOrder } from "@/hooks/mutations/use-complete-order";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function CompleteOrderButton() {
  // Hooks
  const completeOrderMutation = useCompleteOrder();

  // State
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // Methods
  const handleCompleteOrder = async () => {
    try {
      await completeOrderMutation.mutateAsync();

      toast.success("Order completed successfully");
    } catch (error) {
      console.error("Error completing order: ", error);
      toast.error("Error completing order. Please try again.");
    }
  };

  // Renders
  return (
    <>
      <Button
        className="w-full rounded-full"
        size="lg"
        onClick={handleCompleteOrder}
        isLoading={completeOrderMutation.isPending}
        disabled={completeOrderMutation.isPending}
      >
        Complete order
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="text-center">
          <Image
            src="/images/illustration.svg"
            width={300}
            height={400}
            className="mx-auto"
            alt="Success"
          />

          <DialogTitle className="mt-4 text-2xl">Order completed</DialogTitle>
          <DialogDescription className="font-medium">
            Your order has been placed successfully. You can track its status in
            the &quot;My Orders&quot; section.
          </DialogDescription>

          <DialogFooter>
            <Button className="rounded-full" size="lg">
              My Orders
            </Button>
            <Button variant="outline" className="rounded-full" size="lg">
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
