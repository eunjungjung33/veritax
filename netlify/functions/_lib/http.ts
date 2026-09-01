import { timingSafeEqual } from "node:crypto";

export const PRIVATE_RESPONSE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; sandbox",
  "Content-Type": "application/json; charset=utf-8",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=()",
  Pragma: "no-cache",
  "Referrer-Policy": "no-referrer",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  Vary: "Cookie, Origin, Sec-Fetch-Site",
  "X-Content-Type-Options": "nosniff",
  "X-DNS-Prefetch-Control": "off",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-XSS-Protection": "0",
} as const;

export function jsonResponse(body: Record<string, unknown>, status = 200, extraHeaders?: HeadersInit) {
  const headers = new Headers(PRIVATE_RESPONSE_HEADERS);
  if (extraHeaders) {
    new Headers(extraHeaders).forEach((value, key) => headers.set(key, value));
  }
  return new Response(JSON.stringify(body), { status, headers });
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;

  const requestOrigin = new URL(request.url).origin;
  if (origin === requestOrigin) return true;

  const configured = (process.env.ALLOWED_ORIGINS ?? "https://veritax.co.kr,https://www.veritax.co.kr")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (configured.includes(origin)) return true;

  if (process.env.CONTEXT !== "production") {
    try {
      const candidate = new URL(origin);
      return (
        (candidate.protocol === "http:" && ["localhost", "127.0.0.1"].includes(candidate.hostname)) ||
        (candidate.protocol === "https:" && candidate.hostname.endsWith(".netlify.app"))
      );
    } catch {
      return false;
    }
  }

  return false;
}

export function isSameOriginRead(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "same-origin") return true;

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      const forwarded = new Request(request, { headers: new Headers(request.headers) });
      forwarded.headers.set("origin", refererOrigin);
      return isSameOriginRequest(forwarded);
    } catch {
      return false;
    }
  }

  return isSameOriginRequest(request);
}

export function parseCookies(request: Request) {
  const values = new Map<string, string>();
  for (const pair of (request.headers.get("cookie") ?? "").split(";")) {
    const index = pair.indexOf("=");
    if (index < 1) continue;
    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    values.set(key, value);
  }
  return values;
}

export function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isLocalRequest(request: Request) {
  const { hostname, protocol } = new URL(request.url);
  return protocol === "http:" && ["localhost", "127.0.0.1"].includes(hostname);
}
