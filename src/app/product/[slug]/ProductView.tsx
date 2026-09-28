"use client";

import Link from "next/link";
import { useState } from "react";
import { Art } from "@/components/Art";
import { useCart } from "@/components/CartProvider";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/products";

export function ProductView({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const firstAvailable = product.glazes.find((g) => !g.soldOut) ?? product.glazes[0];
  const [glaze, setGlaze] = useState(firstAvailable);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function addToBasket() {
    add(product.slug, glaze.name, qty);
    setAdded(true);
    setOpen(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/shop" className="text-sm text-muted hover:text-ink">← Back to the shop</Link>
      <div className="grid gap-10 md:grid-cols-2 mt-6">
        <Art key={glaze.name} shape={product.shape} glaze={glaze.color} className="w-full aspect-square rounded-3xl" />
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-clay font-semibold">{product.category}</p>
          <h1 className="font-serif text-4xl sm:text-5xl mt-2">{product.name}</h1>
          <p className="text-2xl mt-3">{formatMoney(product.price)}</p>
          <p className="text-muted mt-4 text-lg">{product.blurb}</p>

          <fieldset className="mt-8">
            <legend className="label">
              Glaze: <span className="font-normal">{glaze.name}</span>
            </legend>
            <div className="flex gap-3 mt-1">
              {product.glazes.map((g) => (
                <label key={g.name} className={`relative ${g.soldOut ? "cursor-not-allowed" : "cursor-pointer"}`}>
                  <input
                    type="radio"
                    name="glaze"
                    value={g.name}
                    checked={glaze.name === g.name}
                    disabled={g.soldOut}
                    onChange={() => setGlaze(g)}
                    className="sr-only peer"
                    aria-label={g.soldOut ? `${g.name} (sold out)` : g.name}
                  />
                  <span
                    className="block w-11 h-11 rounded-full border-2 border-transparent peer-checked:border-ink peer-focus-visible:ring-2 ring-clay ring-offset-2 ring-offset-cream"
                    style={{ background: g.color, opacity: g.soldOut ? 0.35 : 1 }}
                  />
                  {g.soldOut && <span className="absolute left-1/2 top-1/2 w-12 h-0.5 bg-ink -translate-x-1/2 -translate-y-1/2 rotate-45" />}
                </label>
              ))}
            </div>
            {product.glazes.some((g) => g.soldOut) && (
              <p className="text-sm text-muted mt-2">
                {product.glazes.filter((g) => g.soldOut).map((g) => g.name).join(", ")} is sold out until the next firing.
              </p>
            )}
          </fieldset>

          <div className="flex items-center gap-4 mt-8">
            <div className="inline-flex items-center border border-ink rounded-full h-12">
              <button className="px-4 h-full" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="w-8 text-center" aria-label="Quantity">{qty}</span>
              <button className="px-4 h-full" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))}>+</button>
            </div>
            <button onClick={addToBasket} className="btn btn-primary flex-1 h-12">
              {added ? "Added to your basket" : `Add to basket · ${formatMoney(product.price * qty)}`}
            </button>
          </div>

          <ul className="mt-10 border-t border-line divide-y divide-line">
            {product.details.map((d) => (
              <li key={d} className="py-3 text-sm">{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
