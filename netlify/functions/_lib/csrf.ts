import { createHmac, randomBytes } from "node:crypto";
import { constantTimeEqual } from "./http";

const TOKEN_MAX_AGE_MS = 30 * 60 * 1000;

function hmac(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function issueCsrfToken(secret: string, now = Date.now()) {
  if (secret.length < 32) throw new Error("CSRF_SECRET must be at least 32 characters");
  const payload = `${randomBytes(24).toString("base64url")}.${now}`;
  return `${payload}.${hmac(payload, secret)}`;
}

export function verifyCsrfToken(token: string, secret: string, now = Date.now()) {
  if (!token || secret.length < 32) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [nonce, timestampValue, signature] = parts;
  if (!nonce || !timestampValue || !signature) return false;

  const timestamp = Number(timestampValue);
  if (!Number.isFinite(timestamp) || timestamp > now + 60_000 || now - timestamp > TOKEN_MAX_AGE_MS) return false;

  const expected = hmac(`${nonce}.${timestampValue}`, secret);
  return constantTimeEqual(signature, expected);
}
