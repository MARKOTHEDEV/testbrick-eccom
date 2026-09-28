"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function Welcome() {
  const { me } = useCart();
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="uppercase tracking-[0.2em] text-xs text-clay font-semibold">You&apos;re in</p>
      <h1 className="font-serif text-5xl mt-3">Welcome, {me?.session?.name.split(" ")[0] ?? "friend"}.</h1>
      <p className="text-muted mt-4">Your account is ready. Use FIRSTFIRE at checkout for 10% off your first order.</p>
      <Link href="/shop" className="btn btn-primary mt-8">Start shopping</Link>
    </div>
  );
}
