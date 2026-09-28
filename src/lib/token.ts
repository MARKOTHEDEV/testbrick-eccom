import { createHmac, randomInt, timingSafeEqual } from "crypto";

const SECRET = process.env.KILN_SECRET || "kiln-dev-secret-change-me";

function b64(s: string) {
  return Buffer.from(s).toString("base64url");
}

function sign(data: string) {
  return createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function seal(payload: object) {
  const body = b64(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function unseal<T>(token: string | undefined): T | null {
  if (!token) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as T;
  } catch {
    return null;
  }
}

export function newCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashCode(email: string, code: string) {
  return sign(`${email.toLowerCase()}:${code}`);
}
