import { sendOrderConfirmation } from "@/lib/mail";
import { computeTotals, type Delivery, type LineItem } from "@/lib/money";
import { getProduct } from "@/lib/products";
import { breakMode, getSession } from "@/lib/session";

type Body = {
  lines?: LineItem[];
  delivery?: Delivery;
  code?: string | null;
  address?: { fullName?: string; line1?: string; city?: string; country?: string; phone?: string };
  card?: { number?: string; expiry?: string; cvc?: string };
};

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Please sign in to check out." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Body;
  const lines = (body.lines ?? []).flatMap((l) => {
    const p = getProduct(l.slug);
    const g = p?.glazes.find((x) => x.name === l.glaze);
    if (!p || !g || g.soldOut || !(l.qty >= 1 && l.qty <= 10)) return [];
    return [{ name: p.name, glaze: g.name, qty: Math.floor(l.qty), price: p.price }];
  });
  if (!lines.length) return Response.json({ error: "Your basket is empty." }, { status: 400 });

  const a = body.address ?? {};
  if (!a.fullName?.trim() || !a.line1?.trim() || !a.city?.trim() || !a.country?.trim()) {
    return Response.json({ error: "Fill in your delivery address." }, { status: 400 });
  }

  const number = (body.card?.number ?? "").replace(/\s/g, "");
  const [mm, yy] = (body.card?.expiry ?? "").split("/").map((s) => parseInt(s, 10));
  const now = new Date();
  const expired = !mm || !yy || mm > 12 || 2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1);
  if (expired) return Response.json({ error: "Your card's expiry date is in the past." }, { status: 400 });
  if (!/^\d{3}$/.test(body.card?.cvc ?? "")) return Response.json({ error: "Enter the 3-digit security code." }, { status: 400 });
  if (number === "4000000000000002") return Response.json({ error: "Your card was declined. Try another card." }, { status: 402 });
  if (number !== "4242424242424242") {
    return Response.json({ error: "Use the test card 4242 4242 4242 4242 — this shop never charges real cards." }, { status: 400 });
  }

  if (breakMode() === "checkout") {
    return Response.json({ error: "We couldn't reach the payment service. Please try again." }, { status: 503 });
  }

  const delivery: Delivery = body.delivery === "express" ? "express" : "standard";
  const totals = computeTotals(lines, delivery, body.code ?? null);
  const id = `KC-${Math.floor(10000 + Math.random() * 90000)}`;

  try {
    await sendOrderConfirmation(session.email, a.fullName.trim(), id, lines, totals);
  } catch (e) {
    console.error("[kiln] order email failed", e);
  }

  return Response.json({ id, lines, totals, delivery, email: session.email, name: a.fullName.trim() });
}
