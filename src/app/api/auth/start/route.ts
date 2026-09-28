import { cookies } from "next/headers";
import { sendCode } from "@/lib/mail";
import { breakMode, PENDING_COOKIE, type Pending } from "@/lib/session";
import { hashCode, newCode, seal, unseal } from "@/lib/token";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string; name?: string; resend?: boolean };
  const store = await cookies();
  const previous = unseal<Pending>(store.get(PENDING_COOKIE)?.value);

  const email = (body.resend ? previous?.email : body.email)?.trim().toLowerCase() ?? "";
  if (!EMAIL.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });

  if (previous && previous.email === email && Date.now() - previous.sentAt < 30_000) {
    return Response.json({ error: "We just sent a code. Give it a few seconds before asking again." }, { status: 429 });
  }

  const fallbackName = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const name = (body.resend ? previous?.name : body.name?.trim()) || fallbackName;

  const code = newCode();
  // The "otp" break: email a code that will never verify.
  const emailed = breakMode() === "otp" ? newCode() : code;

  try {
    await sendCode(email, name, emailed);
  } catch (e) {
    console.error("[kiln] send code failed", e);
    return Response.json({ error: "We couldn't send your code. Try again in a moment." }, { status: 502 });
  }

  const pending: Pending = { email, name, hash: hashCode(email, code), exp: Date.now() + 10 * 60_000, sentAt: Date.now() };
  store.set(PENDING_COOKIE, seal(pending), { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 600 });
  return Response.json({ ok: true, email });
}
