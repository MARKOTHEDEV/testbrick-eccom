import { cookies } from "next/headers";
import { unseal } from "./token";

export type Session = { email: string; name: string };
export type Pending = { email: string; name: string; hash: string; exp: number; sentAt: number };

export const SESSION_COOKIE = "kiln_session";
export const PENDING_COOKIE = "kiln_pending";

export async function getSession() {
  const store = await cookies();
  return unseal<Session>(store.get(SESSION_COOKIE)?.value);
}

export type BreakMode = "none" | "checkout" | "totals" | "otp";

export function breakMode(): BreakMode {
  const m = process.env.KILN_BREAK;
  return m === "checkout" || m === "totals" || m === "otp" ? m : "none";
}
