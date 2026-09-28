"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { LineItem } from "@/lib/money";
import { getProduct } from "@/lib/products";

type Me = { session: { email: string; name: string } | null; pendingEmail: string | null; brokenTotals: boolean };

type Cart = {
  lines: LineItem[];
  count: number;
  add: (slug: string, glaze: string, qty: number) => void;
  setQty: (slug: string, glaze: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  me: Me | null;
  refreshMe: () => Promise<void>;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "kiln_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<LineItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]") as LineItem[];
      setLines(saved.filter((l) => getProduct(l.slug)));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const refreshMe = useCallback(async () => {
    const res = await fetch("/api/me", { cache: "no-store" });
    setMe(await res.json());
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const value = useMemo<Cart>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      add: (slug, glaze, qty) =>
        setLines((prev) => {
          const hit = prev.find((l) => l.slug === slug && l.glaze === glaze);
          if (hit) return prev.map((l) => (l === hit ? { ...l, qty: Math.min(10, l.qty + qty) } : l));
          return [...prev, { slug, glaze, qty }];
        }),
      setQty: (slug, glaze, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => !(l.slug === slug && l.glaze === glaze))
            : prev.map((l) => (l.slug === slug && l.glaze === glaze ? { ...l, qty: Math.min(10, qty) } : l)),
        ),
      clear: () => setLines([]),
      open,
      setOpen,
      me,
      refreshMe,
    }),
    [lines, open, me, refreshMe],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}

export function useLineDetails(lines: LineItem[]) {
  return lines.flatMap((l) => {
    const p = getProduct(l.slug);
    const g = p?.glazes.find((x) => x.name === l.glaze);
    return p && g ? [{ ...l, product: p, color: g.color, price: p.price }] : [];
  });
}
