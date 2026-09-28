"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { OtpInput } from "@/components/OtpInput";

export function VerifyForm({ next }: { next: string }) {
  const router = useRouter();
  const { me, refreshMe } = useCart();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [wait, setWait] = useState(30);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function verify(value = code) {
    if (value.length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: value }),
    });
    const data = await res.json();
    if (!res.ok) {
      setBusy(false);
      return setError(data.error);
    }
    await refreshMe();
    router.push(next === "/" ? "/account/welcome" : next);
  }

  async function resend() {
    setError(null);
    setNotice(null);
    const res = await fetch("/api/auth/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resend: true }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setCode("");
    setWait(30);
    setNotice("A new code is on its way.");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        verify();
      }}
      className="space-y-6"
    >
      {me?.pendingEmail && (
        <p className="text-sm">
          Sent to <strong>{me.pendingEmail}</strong>
        </p>
      )}
      <OtpInput
        value={code}
        invalid={!!error}
        disabled={busy}
        onChange={(v) => {
          setCode(v);
          setError(null);
          if (v.length === 6) verify(v);
        }}
      />
      {error && <p role="alert" className="text-danger text-sm">{error}</p>}
      {notice && <p role="status" className="text-ok text-sm">{notice}</p>}
      <button className="btn btn-primary w-full" disabled={busy || code.length !== 6}>
        {busy ? "Checking…" : "Verify and continue"}
      </button>
      <div className="flex justify-between text-sm text-muted">
        <button type="button" onClick={resend} disabled={wait > 0} className="underline disabled:no-underline">
          {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
        </button>
        <Link href="/account/signup" className="underline">Use a different email</Link>
      </div>
    </form>
  );
}
