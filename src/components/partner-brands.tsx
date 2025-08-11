import Image from "next/image";

export function PartnerBrands() {
  // Constants
  const brands = [
    { name: "Nike", imageUrl: "/images/partner-brands/nike.svg" },
    { name: "Puma", imageUrl: "/images/partner-brands/puma.svg" },
    { name: "Adidas", imageUrl: "/images/partner-brands/adidas.svg" },
    { name: "Converse", imageUrl: "/images/partner-brands/converse.svg" },
    { name: "New Balance", imageUrl: "/images/partner-brands/new-balance.svg" },
    { name: "Zara", imageUrl: "/images/partner-brands/zara.svg" },
    {
      name: "Ralph Lauren",
      imageUrl: "/images/partner-brands/ralph-lauren.svg",
    },
  ];

  // Renders
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">Partner brands</h3>
      <div className="flex w-full gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {brands.map((brand) => (
          <div key={brand.name} className="flex flex-col items-center gap-1">
            <div className="border-accent flex h-24 w-24 items-center overflow-hidden rounded-3xl border-2 p-4">
              <Image
                src={brand.imageUrl}
                alt={brand.name}
                height={0}
                width={0}
                className="h-auto w-full"
              />
            </div>

            <p className="text-xs font-semibold">{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
