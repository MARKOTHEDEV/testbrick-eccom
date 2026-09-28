import Link from "next/link";
import { Art } from "@/components/Art";
import { ProductCard } from "@/components/ProductCard";
import { GLAZES, PRODUCTS } from "@/lib/products";

export default function Home() {
  return (
    <>
      <section className="grain">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-clay font-semibold">Autumn firing · batch 14</p>
            <h1 className="font-serif text-5xl sm:text-7xl leading-[0.95] mt-4">
              Fired slowly.
              <br />
              <em className="text-clay">Made to be used.</em>
            </h1>
            <p className="text-lg text-muted mt-6 max-w-md">
              Mugs, bowls and vases thrown by hand, glazed in small batches and fired for 14 hours. No two are quite the same.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/shop" className="btn btn-primary">Shop the batch</Link>
              <Link href="#story" className="btn btn-ghost">How we make them</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="row-span-2 rounded-3xl overflow-hidden bg-[#e6d6c2] flex items-center">
              <Art shape="vase" glaze={GLAZES.cobalt.color} backdrop="#e6d6c2" className="w-full" />
            </div>
            <Art shape="mug" glaze={GLAZES.terracotta.color} backdrop="#efe3d3" className="rounded-3xl w-full" />
            <Art shape="bowl" glaze={GLAZES.sage.color} backdrop="#e9dccb" className="rounded-3xl w-full" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl">Fresh out of the kiln</h2>
          <Link href="/shop" className="text-sm underline underline-offset-4 hover:text-clay">See everything</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section id="story" className="bg-ink text-cream">
        <div className="max-w-6xl mx-auto px-4 py-20 grid gap-10 md:grid-cols-3">
          {[
            ["Thrown", "Every piece starts as a lump of local clay on the wheel. Nothing is cast in a mould."],
            ["Glazed", "We mix our own glazes. They pool and drip a little differently each time — that's the point."],
            ["Fired", "Fourteen hours at 1240°C, then a full day to cool. Rushing it cracks the pots."],
          ].map(([title, body], i) => (
            <div key={title}>
              <p className="font-serif text-6xl text-clay">0{i + 1}</p>
              <h3 className="font-serif text-2xl mt-3">{title}</h3>
              <p className="text-cream/70 mt-2">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
