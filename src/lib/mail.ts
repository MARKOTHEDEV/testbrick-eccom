import { Resend } from "resend";
import { formatMoney, type Totals } from "./money";

const FROM = process.env.KILN_EMAIL_FROM || "Kiln & Co. <hello@kiln.local>";

function shell(inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#f6efe6;font-family:Helvetica,Arial,sans-serif;color:#2b211c">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fffaf4;border:1px solid #e0d0bc;border-radius:16px">
<tr><td style="padding:28px 32px 0;font-family:Georgia,serif;font-size:22px">Kiln <span style="color:#c0643f">&amp;</span> Co.</td></tr>
<tr><td style="padding:20px 32px 32px">${inner}</td></tr>
</table>
<p style="font-size:12px;color:#7a6a5e;margin-top:16px">Kiln &amp; Co. · small-batch ceramics · this is a demo shop, nothing ships</p>
</td></tr></table></body></html>`;
}

async function send(to: string, subject: string, html: string, text: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[kiln mail] to=${to} subject="${subject}"\n${text}`);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from: FROM, to, subject, html, text });
  if (error) throw new Error(error.message);
}

export async function sendCode(to: string, name: string, code: string) {
  const digits = code
    .split("")
    .map(
      (d) =>
        `<td style="width:44px;height:52px;border:1px solid #e0d0bc;border-radius:10px;background:#f6efe6;text-align:center;font-size:26px;font-weight:700">${d}</td>`,
    )
    .join('<td style="width:6px"></td>');
  const html = shell(`
<p style="font-size:16px;margin:0 0 16px">Hi ${escape(name)},</p>
<p style="font-size:16px;margin:0 0 20px">Here's your code to finish signing in. It works for 10 minutes.</p>
<table cellpadding="0" cellspacing="0"><tr>${digits}</tr></table>
<p style="font-size:14px;color:#7a6a5e;margin:24px 0 0">If you didn't ask for this, you can ignore this email.</p>`);
  const text = `Hi ${name},\n\nYour Kiln & Co. code is ${code}. It works for 10 minutes.`;
  await send(to, "Your Kiln & Co. sign-in code", html, text);
}

export async function sendOrderConfirmation(
  to: string,
  name: string,
  orderId: string,
  lines: { name: string; glaze: string; qty: number; price: number }[],
  totals: Totals,
) {
  const rows = lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0">${l.qty} × ${escape(l.name)} <span style="color:#7a6a5e">(${escape(l.glaze)})</span></td><td align="right">${formatMoney(l.price * l.qty)}</td></tr>`,
    )
    .join("");
  const sum = (label: string, v: number, bold = false) =>
    `<tr><td style="padding:4px 0;${bold ? "font-weight:700" : "color:#7a6a5e"}">${label}</td><td align="right" style="${bold ? "font-weight:700" : ""}">${formatMoney(v)}</td></tr>`;
  const html = shell(`
<p style="font-size:16px;margin:0 0 8px">Thanks, ${escape(name)}.</p>
<p style="font-size:16px;margin:0 0 20px">Order <strong>${orderId}</strong> is in the kiln.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #e0d0bc;padding-top:8px">${rows}</table>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #e0d0bc;margin-top:8px;padding-top:8px">
${sum("Subtotal", totals.subtotal)}${totals.discount ? sum("Discount", -totals.discount) : ""}${sum("Shipping", totals.shipping)}${sum("VAT (7.5%)", totals.vat)}${sum("Total", totals.total, true)}
</table>`);
  const text = `Thanks, ${name}. Order ${orderId} is in the kiln. Total ${formatMoney(totals.total)}.`;
  await send(to, `Order ${orderId} is in the kiln`, html, text);
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
