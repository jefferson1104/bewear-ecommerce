import { Header } from "@/components/header";

export default async function ConfirmationPage() {
  // Renders
  return (
    <>
      <Header showBackButton hideCart hideMenu />

      <div className="px-5">
        <h1>Order Confirmation</h1>
        <p>Your order has been placed successfully!</p>
      </div>
    </>
  );
}
