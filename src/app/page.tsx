import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  // Renders
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-black">Home Page</h1>
        <Link href="/product">
          <Button>Go to Product Page</Button>
        </Link>
      </div>
    </div>
  );
}
