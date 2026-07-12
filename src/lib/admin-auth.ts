// Minimal single-password session auth for /admin. No user accounts, no
// database - just a shared password (ADMIN_PASSWORD env var) and a signed,
// httpOnly cookie. Good enough for a single non-technical site owner.

export const SESSION_COOKIE_NAME = "proclean_admin_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecret(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Add it to your .env file to enable /admin.",
    );
  }
  return password;
}

async function sign(value: string): Promise<string> {
  const { createHmac } = await import("node:crypto");
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const signature = await sign(String(expiresAt));
  return `${expiresAt}.${signature}`;
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expiresAtStr, signature] = token.split(".");
  if (!expiresAtStr || !signature) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expected = await sign(expiresAtStr);
  const { timingSafeEqual } = await import("node:crypto");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function checkPassword(candidate: string): Promise<boolean> {
  const { timingSafeEqual } = await import("node:crypto");
  const expected = Buffer.from(getSecret());
  const actual = Buffer.from(candidate);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const out: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export async function requireAdminSession(request: Request): Promise<boolean> {
  const cookies = parseCookies(request.headers.get("cookie"));
  return isValidSessionToken(cookies[SESSION_COOKIE_NAME]);
}
