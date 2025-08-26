import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Addresses } from "@/components/addresses";
import { Header } from "@/components/header";
import { db } from "@/db";
import { cartsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function IdentificationPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const cart = await db.query.cartsTable.findFirst({
    where: eq(cartsTable.userId, session.user.id),
    with: {
      items: true,
    },
  });

  // Renders
  if (!cart || cart.items.length === 0) {
    redirect("/");
  }

  return (
    <>
      <Header />
      <div className="px-5">
        <Addresses />
      </div>
    </>
  );
}
