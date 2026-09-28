import { cookies } from "next/headers";
import { breakMode, getSession, PENDING_COOKIE, type Pending } from "@/lib/session";
import { unseal } from "@/lib/token";

export async function GET() {
  const pending = unseal<Pending>((await cookies()).get(PENDING_COOKIE)?.value);
  return Response.json({
    session: await getSession(),
    pendingEmail: pending?.email ?? null,
    brokenTotals: breakMode() === "totals",
  });
}
