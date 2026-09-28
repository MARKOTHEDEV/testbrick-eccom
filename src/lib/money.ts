export type LineItem = { slug: string; glaze: string; qty: number };

export type Delivery = "standard" | "express";

export const FREE_SHIPPING_FROM = 7500;
export const VAT_RATE = 0.075;
export const DISCOUNTS: Record<string, number> = { FIRSTFIRE: 0.1 };

export function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function shippingFor(subtotal: number, delivery: Delivery) {
  if (delivery === "express") return 1400;
  return subtotal >= FREE_SHIPPING_FROM ? 0 : 600;
}

export type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  vat: number;
  total: number;
};

export function computeTotals(
  lines: { price: number; qty: number }[],
  delivery: Delivery,
  code: string | null,
  broken = false,
): Totals {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const rate = code ? DISCOUNTS[code.toUpperCase()] ?? 0 : 0;
  const discount = Math.round(subtotal * rate);
  const shipping = shippingFor(subtotal - discount, delivery);
  const vat = Math.round((subtotal - discount) * VAT_RATE);
  // The "totals" break: forget to add shipping to the total.
  const total = subtotal - discount + vat + (broken ? 0 : shipping);
  return { subtotal, discount, shipping, vat, total };
}
