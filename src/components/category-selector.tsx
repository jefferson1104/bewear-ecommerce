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
            key={category.id}
            variant="ghost"
            className="rounded-full bg-white text-sm font-semibold"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
