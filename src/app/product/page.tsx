import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProductPage() {
  // Renders
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-black">Product Page</h1>
      <Link href="/" replace>
        <Button variant="outline">Go Back</Button>
      </Link>
    </div>
  );
}
