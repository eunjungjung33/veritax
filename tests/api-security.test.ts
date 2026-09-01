import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const setJSON = vi.hoisted(() => vi.fn());

vi.mock("@netlify/blobs", () => ({
  getStore: () => ({ setJSON }),
}));

import csrf, { config as csrfConfig } from "../netlify/functions/csrf";
import consultations, { config as consultationsConfig } from "../netlify/functions/consultations";

const csrfSecret = "test-csrf-secret-with-more-than-thirty-two-characters";
const encryptionKey = Buffer.alloc(32, 11).toString("base64");

describe("consultation API boundary", () => {
  beforeEach(() => {
    process.env.CSRF_SECRET = csrfSecret;
    process.env.CONSULTATION_ENCRYPTION_KEY = encryptionKey;
    process.env.CONTEXT = "production";
    setJSON.mockReset();
    setJSON.mockResolvedValue({ modified: true });
  });

  afterEach(() => {
    delete process.env.CSRF_SECRET;
    delete process.env.CONSULTATION_ENCRYPTION_KEY;
    delete process.env.CONTEXT;
  });

  it("rejects cross-site token requests and submissions", async () => {
    const tokenResponse = await csrf(new Request("https://veritax.co.kr/api/csrf", {
      headers: { "Sec-Fetch-Site": "cross-site" },
    }));
    expect(tokenResponse.status).toBe(403);

    const submissionResponse = await consultations(new Request("https://veritax.co.kr/api/consultations", {
      method: "POST",
      headers: { Origin: "https://attacker.example", "Content-Type": "application/json" },
      body: "{}",
    }), { requestId: "cross-site-test" } as never);
    expect(submissionResponse.status).toBe(403);
    expect(setJSON).not.toHaveBeenCalled();
  });

  it("keeps platform rate limits within Netlify's supported window", () => {
    expect(csrfConfig.rateLimit?.windowSize).toBeLessThanOrEqual(180);
    expect(consultationsConfig.rateLimit?.windowSize).toBeLessThanOrEqual(180);
    expect(consultationsConfig.rateLimit?.windowLimit).toBe(5);
  });

  it("accepts a same-origin CSRF flow and stores only an encrypted envelope", async () => {
    const tokenResponse = await csrf(new Request("https://veritax.co.kr/api/csrf", {
      headers: { "Sec-Fetch-Site": "same-origin" },
    }));
    expect(tokenResponse.status).toBe(200);
    const tokenBody = await tokenResponse.json() as { token: string };
    const setCookie = tokenResponse.headers.get("set-cookie") ?? "";
    const cookie = setCookie.split(";", 1)[0];
    expect(cookie).toContain("__Host-veritax_csrf=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Strict");
    expect(setCookie).toContain("Secure");

    const payload = {
      service: "세무 컨설팅",
      name: "홍길동",
      phone: "010-1234-5678",
      email: "client@example.com",
      contactPreference: "phone",
      message: "세무조사 사전 통지를 받아 상담을 요청드립니다.",
      website: "",
      consent: true,
      startedAt: Date.now() - 5_000,
    };
    const response = await consultations(new Request("https://veritax.co.kr/api/consultations", {
      method: "POST",
      headers: {
        Origin: "https://veritax.co.kr",
        "Sec-Fetch-Site": "same-origin",
        "Content-Type": "application/json",
        Cookie: cookie,
        "X-CSRF-Token": tokenBody.token,
      },
      body: JSON.stringify(payload),
    }), { requestId: "same-origin-test" } as never);

    expect(response.status).toBe(201);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("content-security-policy")).toContain("default-src 'none'");
    expect(setJSON).toHaveBeenCalledOnce();
    const [, envelope] = setJSON.mock.calls[0] as [string, Record<string, unknown>];
    expect(envelope.algorithm).toBe("AES-256-GCM");
    expect(JSON.stringify(envelope)).not.toContain(payload.name);
    expect(JSON.stringify(envelope)).not.toContain(payload.phone);
    expect(JSON.stringify(envelope)).not.toContain(payload.message);
  });
});
