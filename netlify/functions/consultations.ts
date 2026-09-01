import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";
import { randomBytes, randomUUID } from "node:crypto";
import { verifyCsrfToken } from "./_lib/csrf";
import { encryptConsultation } from "./_lib/encryption";
import { constantTimeEqual, isLocalRequest, isSameOriginRequest, jsonResponse, parseCookies } from "./_lib/http";
import { MAX_BODY_BYTES, validateConsultation } from "./_lib/validation";

function receiptId(now: Date) {
  const day = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `VTX-${day}-${randomBytes(5).toString("hex").toUpperCase()}`;
}

function retentionDays() {
  const configured = Number(process.env.CONSULTATION_RETENTION_DAYS ?? "90");
  return Number.isInteger(configured) && configured >= 1 && configured <= 365 ? configured : 90;
}

export default async function consultations(request: Request, context: Context) {
  if (request.method !== "POST") {
    return jsonResponse({ message: "허용되지 않은 요청입니다." }, 405, { Allow: "POST" });
  }
  if (!isSameOriginRequest(request)) return jsonResponse({ message: "요청 출처를 확인할 수 없습니다." }, 403);
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    return jsonResponse({ message: "입력 형식을 확인해 주세요." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) return jsonResponse({ message: "입력 내용이 너무 깁니다." }, 413);

  const csrfSecret = process.env.CSRF_SECRET;
  const encryptionKey = process.env.CONSULTATION_ENCRYPTION_KEY;
  if (!csrfSecret || !encryptionKey) {
    return jsonResponse({ message: "안전한 접수 준비 중입니다. 잠시 후 다시 시도해 주세요." }, 503);
  }

  const submittedToken = request.headers.get("x-csrf-token") ?? "";
  const cookies = parseCookies(request);
  const cookieName = isLocalRequest(request) ? "veritax_csrf_dev" : "__Host-veritax_csrf";
  const cookieToken = cookies.get(cookieName) ?? "";
  if (!submittedToken || !cookieToken || !constantTimeEqual(submittedToken, cookieToken) || !verifyCsrfToken(submittedToken, csrfSecret)) {
    return jsonResponse({ message: "보안 확인 시간이 만료되었습니다. 다시 시도해 주세요." }, 403);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({ message: "입력 내용을 읽을 수 없습니다." }, 400);
  }
  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) return jsonResponse({ message: "입력 내용이 너무 깁니다." }, 413);

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ message: "입력 형식을 확인해 주세요." }, 400);
  }

  const validation = validateConsultation(parsed);
  if (!validation.ok) return jsonResponse({ message: validation.message }, 422);

  const now = new Date();
  const receipt = receiptId(now);
  if (validation.isSpam) return jsonResponse({ receiptId: receipt }, 201);

  const expiresAt = new Date(now.getTime() + retentionDays() * 86_400_000).toISOString();
  try {
    const envelope = encryptConsultation(
      {
        ...validation.value,
        receiptId: receipt,
        submittedAt: now.toISOString(),
        expiresAt,
      },
      encryptionKey,
      process.env.CONSULTATION_KEY_VERSION ?? "v1",
    );
    const storageKey = `v1/${now.toISOString().slice(0, 10)}/${randomUUID()}`;
    const store = getStore("veritax-consultations");
    const result = await store.setJSON(storageKey, envelope, {
      metadata: { schemaVersion: 1, expiresAt, purpose: "consultation" },
      onlyIfNew: true,
    });
    if (!result.modified) throw new Error("conditional_write_failed");
  } catch {
    console.error("consultation_store_failed", { requestId: context.requestId });
    return jsonResponse({ message: "안전하게 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." }, 503);
  }

  return jsonResponse({ receiptId: receipt }, 201, {
    "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isLocalRequest(request) ? "" : "; Secure"}`,
  });
}

export const config: Config = {
  path: "/api/consultations",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["domain", "ip"],
    windowLimit: 5,
    windowSize: 180,
  },
};
