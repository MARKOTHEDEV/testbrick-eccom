"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Art } from "@/components/Art";
import { useCart, useLineDetails } from "@/components/CartProvider";
import { computeTotals, DISCOUNTS, formatMoney, FREE_SHIPPING_FROM, type Delivery } from "@/lib/money";

const COUNTRIES = ["Nigeria", "Ghana", "Kenya", "South Africa", "United Kingdom", "United States"];

function maskCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function maskExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export default function Checkout() {
  const router = useRouter();
  const { lines, me, clear } = useCart();
  const items = useLineDetails(lines);
  const [delivery, setDelivery] = useState<Delivery>("standard");
  const [codeInput, setCodeInput] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [codeMsg, setCodeMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [address, setAddress] = useState({ fullName: "", line1: "", city: "", country: "Nigeria", phone: "" });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!me) return <div className="max-w-6xl mx-auto px-4 py-24 text-muted">Loading…</div>;

  if (!me.session) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-4xl">Sign in to check out</h1>
        <p className="text-muted mt-3">We&apos;ll email you a code — no password needed.</p>
        <div className="flex flex-col gap-3 mt-8">
          <Link href="/account/signup?next=/checkout" className="btn btn-primary">Create an account</Link>
          <Link href="/account/login?next=/checkout" className="btn btn-ghost">I already have one</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-4xl">Your basket is empty</h1>
        <Link href="/shop" className="btn btn-primary mt-8">Browse the shop</Link>
      </div>
    );
  }

  const totals = computeTotals(items, delivery, code, me.brokenTotals);

  function applyCode() {
    const c = codeInput.trim().toUpperCase();
    if (DISCOUNTS[c]) {
      setCode(c);
      setCodeMsg({ ok: true, text: `${c} applied — ${DISCOUNTS[c] * 100}% off.` });
    } else {
      setCode(null);
      setCodeMsg({ ok: false, text: "That code isn't valid." });
    }
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines, delivery, code, address, card }),
    });
    const data = await res.json();
    if (!res.ok) {
      setBusy(false);
      return setError(data.error);
    }
    try {
      sessionStorage.setItem("kiln_last_order", JSON.stringify(data));
    } catch {}
    clear();
    router.push(`/order/${data.id}`);
  }

  const set = (k: keyof typeof address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddress((a) => ({ ...a, [k]: e.target.value }));

  return (
    <form onSubmit={placeOrder} className="max-w-6xl mx-auto px-4 py-10 grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-10">
        <h1 className="font-serif text-4xl">Checkout</h1>

        <section>
          <h2 className="font-serif text-2xl mb-4">1. Contact</h2>
          <p className="text-sm">Signed in as <strong>{me.session.email}</strong></p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl">2. Delivery address</h2>
          <div>
            <label htmlFor="fullName" className="label">Full name</label>
            <input id="fullName" className="field" required autoComplete="name" value={address.fullName} onChange={set("fullName")} />
          </div>
          <div>
            <label htmlFor="line1" className="label">Street address</label>
            <input id="line1" className="field" required autoComplete="address-line1" value={address.line1} onChange={set("line1")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="label">City</label>
              <input id="city" className="field" required autoComplete="address-level2" value={address.city} onChange={set("city")} />
            </div>
            <div>
              <label htmlFor="country" className="label">Country</label>
              <select id="country" className="field" value={address.country} onChange={set("country")}>
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="label">Phone <span className="font-normal text-muted">(optional, for the courier)</span></label>
            <input id="phone" type="tel" className="field" autoComplete="tel" value={address.phone} onChange={set("phone")} />
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">3. Delivery</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["standard", "Standard", "3–5 working days", totals.subtotal - totals.discount >= FREE_SHIPPING_FROM ? "Free" : formatMoney(600)],
                ["express", "Express", "Next working day", formatMoney(1400)],
              ] as const
            ).map(([value, title, eta, price]) => (
              <label key={value} className={`rounded-2xl border p-4 cursor-pointer flex justify-between ${delivery === value ? "border-ink bg-oat" : "border-line"}`}>
                <span className="flex gap-3">
                  <input type="radio" name="delivery" value={value} checked={delivery === value} onChange={() => setDelivery(value)} className="accent-clay mt-1" />
                  <span>
                    <span className="font-semibold block">{title}</span>
                    <span className="text-sm text-muted">{eta}</span>
                  </span>
                </span>
                <span className="font-semibold">{price}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl">4. Payment</h2>
          <div className="rounded-xl bg-oat px-4 py-3 text-sm">
            <strong>Test mode.</strong> Use card <span className="font-mono">4242 4242 4242 4242</span>, any future date and any 3 digits. Nothing is charged.
          </div>
          <div>
            <label htmlFor="cardNumber" className="label">Card number</label>
            <input id="cardNumber" className="field font-mono" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" required value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: maskCard(e.target.value) }))} />
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div>
              <label htmlFor="expiry" className="label">Expiry (MM/YY)</label>
              <input id="expiry" className="field font-mono" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" required value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: maskExpiry(e.target.value) }))} />
            </div>
            <div>
              <label htmlFor="cvc" className="label">Security code</label>
              <input id="cvc" className="field font-mono" inputMode="numeric" autoComplete="cc-csc" placeholder="123" required maxLength={3} value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) }))} />
            </div>
          </div>
        </section>

        {error && (
          <div role="alert" className="rounded-xl border border-danger/40 bg-danger/5 text-danger px-4 py-3">
            {error}
          </div>
        )}
        <button className="btn btn-primary w-full h-14 text-lg" disabled={busy}>
          {busy ? "Placing your order…" : `Place order · ${formatMoney(totals.total)}`}
        </button>
      </div>

      <aside className="lg:sticky lg:top-24 self-start rounded-3xl bg-[#fffaf4] border border-line p-6">
        <h2 className="font-serif text-2xl">Order summary</h2>
        <ul className="divide-y divide-line mt-4">
          {items.map((i) => (
            <li key={`${i.slug}-${i.glaze}`} className="py-3 flex gap-3 items-center">
              <Art shape={i.product.shape} glaze={i.color} className="w-14 h-14 rounded-lg" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{i.product.name}</p>
                <p className="text-muted">{i.glaze} · Qty {i.qty}</p>
              </div>
              <p className="text-sm font-semibold">{formatMoney(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 mt-4">
          <input aria-label="Discount code" className="field !py-2" placeholder="Discount code" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} />
          <button type="button" onClick={applyCode} className="btn btn-ghost !py-2">Apply</button>
        </div>
        {codeMsg && <p className={`text-sm mt-2 ${codeMsg.ok ? "text-ok" : "text-danger"}`}>{codeMsg.text}</p>}
        <dl className="mt-5 space-y-2 text-sm border-t border-line pt-4">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatMoney(totals.subtotal)}</dd></div>
          {totals.discount > 0 && <div className="flex justify-between"><dt className="text-muted">Discount ({code})</dt><dd>−{formatMoney(totals.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{totals.shipping ? formatMoney(totals.shipping) : "Free"}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">VAT (7.5%)</dt><dd>{formatMoney(totals.vat)}</dd></div>
          <div className="flex justify-between text-lg font-semibold border-t border-line pt-3"><dt>Total</dt><dd>{formatMoney(totals.total)}</dd></div>
        </dl>
      </aside>
    </form>
  );
}
