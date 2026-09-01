import type { Config } from "@netlify/functions";
import { issueCsrfToken } from "./_lib/csrf";
import { isLocalRequest, isSameOriginRead, jsonResponse } from "./_lib/http";

export default async function csrf(request: Request) {
  if (request.method !== "GET") {
    return jsonResponse({ message: "허용되지 않은 요청입니다." }, 405, { Allow: "GET" });
  }
  if (!isSameOriginRead(request)) {
    return jsonResponse({ message: "요청 출처를 확인할 수 없습니다." }, 403);
  }

  const secret = process.env.CSRF_SECRET;
  if (!secret) return jsonResponse({ message: "보안 설정을 확인하고 있습니다. 잠시 후 다시 시도해 주세요." }, 503);

  try {
    const token = issueCsrfToken(secret);
    const local = isLocalRequest(request);
    const cookieName = local ? "veritax_csrf_dev" : "__Host-veritax_csrf";
    const secure = local ? "" : "; Secure";
    return jsonResponse(
      { token },
      200,
      { "Set-Cookie": `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=1800${secure}` },
    );
  } catch {
    return jsonResponse({ message: "보안 설정을 확인하고 있습니다. 잠시 후 다시 시도해 주세요." }, 503);
  }
}

export const config: Config = {
  path: "/api/csrf",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["domain", "ip"],
    windowLimit: 20,
    windowSize: 60,
  },
};
