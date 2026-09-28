import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/products";
import { Art } from "./Art";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden">
        <Art shape={product.shape} glaze={product.glazes[0].color} className="w-full aspect-square transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold group-hover:text-clay">{product.name}</p>
          <div className="flex gap-1.5 mt-1.5">
            {product.glazes.map((g) => (
              <span key={g.name} title={g.name} className="w-3.5 h-3.5 rounded-full border border-ink/10" style={{ background: g.color }} />
            ))}
          </div>
        </div>
        <p className="text-muted">{formatMoney(product.price)}</p>
      </div>
    </Link>
  );
}
