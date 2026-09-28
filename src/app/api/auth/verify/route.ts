import { cookies } from "next/headers";
import { PENDING_COOKIE, SESSION_COOKIE, type Pending, type Session } from "@/lib/session";
import { hashCode, seal, unseal } from "@/lib/token";

export async function POST(req: Request) {
  const { code } = (await req.json().catch(() => ({}))) as { code?: string };
  const store = await cookies();
  const pending = unseal<Pending>(store.get(PENDING_COOKIE)?.value);

  if (!pending) return Response.json({ error: "Your code expired. Ask for a new one." }, { status: 400 });
  if (Date.now() > pending.exp) return Response.json({ error: "Your code expired. Ask for a new one." }, { status: 400 });
  if (!code || !/^\d{6}$/.test(code) || hashCode(pending.email, code) !== pending.hash) {
    return Response.json({ error: "That code didn't work. Check the email and try again." }, { status: 400 });
  }

  const session: Session = { email: pending.email, name: pending.name };
  store.delete(PENDING_COOKIE);
  store.set(SESSION_COOKIE, seal(session), { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
  return Response.json({ ok: true, ...session });
}
