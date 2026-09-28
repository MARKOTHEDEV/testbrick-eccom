"use client";

import Link from "next/link";
import { formatMoney, FREE_SHIPPING_FROM } from "@/lib/money";
import { Art } from "./Art";
import { useCart, useLineDetails } from "./CartProvider";

export function CartDrawer() {
  const { lines, open, setOpen, setQty } = useCart();
  const items = useLineDetails(lines);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const toFree = FREE_SHIPPING_FROM - subtotal;

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Your basket"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-cream shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-line">
          <h2 className="font-serif text-xl">Your basket</h2>
          <button onClick={() => setOpen(false)} className="text-muted hover:text-ink text-sm">Close</button>
        </div>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <p className="font-serif text-2xl">Your basket is empty.</p>
            <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-ghost">Browse the shop</Link>
          </div>
        ) : (
          <>
            <div className="px-6 py-3 text-sm bg-oat">
              {toFree > 0 ? <>You&apos;re {formatMoney(toFree)} away from free shipping.</> : <>You&apos;ve unlocked free shipping.</>}
            </div>
            <ul className="flex-1 overflow-y-auto divide-y divide-line px-6">
              {items.map((i) => (
                <li key={`${i.slug}-${i.glaze}`} className="py-4 flex gap-4">
                  <Art shape={i.product.shape} glaze={i.color} className="w-20 h-20 rounded-xl" />
                  <div className="flex-1">
                    <p className="font-semibold">{i.product.name}</p>
                    <p className="text-sm text-muted">{i.glaze}</p>
                    <div className="mt-2 inline-flex items-center border border-line rounded-full">
                      <button className="px-3 py-1" aria-label={`Decrease ${i.product.name}`} onClick={() => setQty(i.slug, i.glaze, i.qty - 1)}>−</button>
                      <span className="w-6 text-center text-sm">{i.qty}</span>
                      <button className="px-3 py-1" aria-label={`Increase ${i.product.name}`} onClick={() => setQty(i.slug, i.glaze, i.qty + 1)}>+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatMoney(i.price * i.qty)}</p>
                    <button className="text-xs text-muted underline mt-2" onClick={() => setQty(i.slug, i.glaze, 0)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-6 space-y-4">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary w-full">Check out</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
