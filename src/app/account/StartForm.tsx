"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StartForm({ mode, next }: { mode: "signup" | "login"; next: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/auth/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: mode === "signup" ? name : undefined }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error);
    router.push(`/account/verify?next=${encodeURIComponent(next)}`);
  }

  const q = next !== "/" ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form onSubmit={submit} className="space-y-5">
      {mode === "signup" && (
        <div>
          <label htmlFor="name" className="label">Your name</label>
          <input id="name" className="field" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Obi" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="label">Email address</label>
        <input id="email" type="email" className="field" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      {mode === "signup" && (
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" className="mt-1 accent-clay" defaultChecked />
          Email me when a new batch comes out of the kiln (about once a month).
        </label>
      )}
      {error && <p role="alert" className="text-danger text-sm">{error}</p>}
      <button className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Sending your code…" : mode === "signup" ? "Create account" : "Email me a code"}
      </button>
      <p className="text-sm text-muted text-center">
        {mode === "signup" ? (
          <>Already have an account? <Link href={`/account/login${q}`} className="text-ink underline">Sign in</Link></>
        ) : (
          <>New to Kiln &amp; Co.? <Link href={`/account/signup${q}`} className="text-ink underline">Create an account</Link></>
        )}
      </p>
    </form>
  );
}
