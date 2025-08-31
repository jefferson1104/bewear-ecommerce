"use client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCompleteOrder } from "@/hooks/mutations/use-complete-order";

export function CompleteOrderButton() {
  // Hooks
  const completeOrderMutation = useCompleteOrder();

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
    <Button
      className="w-full rounded-full"
      size="lg"
      onClick={handleCompleteOrder}
      isLoading={completeOrderMutation.isPending}
      disabled={completeOrderMutation.isPending}
    >
      Complete order
    </Button>
  );
}
