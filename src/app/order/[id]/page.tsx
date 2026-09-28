"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatMoney, type Totals } from "@/lib/money";

type Order = {
  id: string;
  email: string;
  name: string;
  delivery: "standard" | "express";
  lines: { name: string; glaze: string; qty: number; price: number }[];
  totals: Totals;
};

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("kiln_last_order") ?? "null") as Order | null;
      setOrder(saved?.id === id ? saved : null);
    } catch {
      setOrder(null);
    }
  }, [id]);

  if (order === undefined) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <p className="uppercase tracking-[0.2em] text-xs text-clay font-semibold">Order confirmed</p>
      <h1 className="font-serif text-5xl mt-3">Order {id} is in the kiln.</h1>
      {order ? (
        <>
          <p className="text-muted mt-4">
            Thanks, {order.name.split(" ")[0]}. We&apos;ve emailed a receipt to <strong className="text-ink">{order.email}</strong>.{" "}
            {order.delivery === "express" ? "It ships next working day." : "It ships in 3–5 working days."}
          </p>
          <div className="rounded-3xl bg-[#fffaf4] border border-line p-6 mt-8">
            <ul className="space-y-2 text-sm">
              {order.lines.map((l) => (
                <li key={`${l.name}-${l.glaze}`} className="flex justify-between">
                  <span>{l.qty} × {l.name} <span className="text-muted">({l.glaze})</span></span>
                  <span>{formatMoney(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-semibold text-lg border-t border-line mt-4 pt-4">
              <span>Total paid</span>
              <span>{formatMoney(order.totals.total)}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-muted mt-4">We&apos;ve emailed you a receipt.</p>
      )}
      <Link href="/shop" className="btn btn-ghost mt-8">Keep browsing</Link>
    </div>
  );
}
