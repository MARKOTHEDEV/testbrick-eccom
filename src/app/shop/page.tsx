import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export default async function Shop({ searchParams }: PageProps<"/shop">) {
  const { c } = await searchParams;
  const active = typeof c === "string" && CATEGORIES.includes(c as never) ? c : null;
  const items = active ? PRODUCTS.filter((p) => p.category === active) : PRODUCTS;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl sm:text-5xl">The shop</h1>
      <p className="text-muted mt-2">{items.length} pieces from batch 14</p>
      <div className="flex flex-wrap gap-2 mt-6 mb-10">
        {[null, ...CATEGORIES].map((cat) => (
          <Link
            key={cat ?? "all"}
            href={cat ? `/shop?c=${cat}` : "/shop"}
            className={`px-4 py-1.5 rounded-full border text-sm ${active === cat ? "bg-ink text-cream border-ink" : "border-line hover:border-ink"}`}
          >
            {cat ?? "All"}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
