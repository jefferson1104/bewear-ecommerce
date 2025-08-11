import Link from "next/link";

import { Button } from "@/components/ui/button";
import { categoriesTable } from "@/db/schema";

interface ICategorySelectorProps {
  categories: (typeof categoriesTable.$inferSelect)[];
}

export function CategorySelector({ categories }: ICategorySelectorProps) {
  // Renders
  return (
    <div className="rounded-3xl bg-[#F4EFFF] p-6">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Button
            asChild
            key={category.id}
            variant="ghost"
            className="rounded-full bg-white text-sm font-semibold"
          >
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
