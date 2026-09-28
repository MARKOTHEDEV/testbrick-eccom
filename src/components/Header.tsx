"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { Logo } from "./Logo";

export function Header() {
  const { count, setOpen, me, refreshMe } = useCart();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshMe();
    router.push("/");
  }

  return (
    <>
      <div className="bg-ink text-cream text-center text-xs py-2 px-4">
        Free shipping on orders over $75 · New here? Use <strong>FIRSTFIRE</strong> for 10% off
      </div>
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
          <Link href="/" aria-label="Kiln & Co. home">
            <Logo />
          </Link>
          <nav className="hidden sm:flex gap-5 text-sm">
            <Link href="/shop" className="hover:text-clay">Shop all</Link>
            <Link href="/shop?c=Mugs" className="hover:text-clay">Mugs</Link>
            <Link href="/shop?c=Vases" className="hover:text-clay">Vases</Link>
            <Link href="/#story" className="hover:text-clay">Our story</Link>
          </nav>
          <div className="ml-auto flex items-center gap-4 text-sm">
            {me?.session ? (
              <>
                <span className="hidden sm:inline text-muted">Hi, {me.session.name.split(" ")[0]}</span>
                <button onClick={signOut} className="hover:text-clay">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/account/login" className="hover:text-clay">Sign in</Link>
                <Link href="/account/signup" className="hidden sm:inline hover:text-clay">Create account</Link>
              </>
            )}
            <button onClick={() => setOpen(true)} className="btn btn-primary !py-2 !px-4" aria-label={`Basket, ${count} items`}>
              Basket <span className="bg-clay text-cream rounded-full min-w-6 h-6 px-1.5 inline-flex items-center justify-center text-xs">{count}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
