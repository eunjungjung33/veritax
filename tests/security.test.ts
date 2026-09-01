import { describe, expect, it } from "vitest";
import { issueCsrfToken, verifyCsrfToken } from "../netlify/functions/_lib/csrf";
import { decryptConsultation, encryptConsultation } from "../netlify/functions/_lib/encryption";
import { validateConsultation } from "../netlify/functions/_lib/validation";

const now = Date.UTC(2026, 8, 2, 12, 0, 0);
const validInput = {
  service: "세무 컨설팅",
  name: "홍길동",
  phone: "010-1234-5678",
  email: "client@example.com",
  contactPreference: "phone",
  message: "세무조사 사전 통지를 받아 상담을 요청드립니다.",
  website: "",
  consent: true,
  startedAt: now - 5_000,
};

describe("consultation validation", () => {
  it("accepts the minimum legitimate payload", () => {
    const result = validateConsultation(validInput, now);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.isSpam).toBe(false);
  });

  it("silently marks honeypot submissions as spam", () => {
    const result = validateConsultation({ ...validInput, website: "https://spam.example" }, now);
    expect(result).toEqual({ ok: true, isSpam: true });
  });

  it("rejects missing consent and dangerous control characters", () => {
    expect(validateConsultation({ ...validInput, consent: false }, now).ok).toBe(false);
    expect(validateConsultation({ ...validInput, name: "홍\u202E길동" }, now).ok).toBe(false);
  });

  it("rejects highly sensitive numbers and credential-like values before storage", () => {
    expect(validateConsultation({ ...validInput, message: "확인을 위해 900101-1234567을 전달합니다." }, now).ok).toBe(false);
    expect(validateConsultation({ ...validInput, message: "결제 카드 4111 1111 1111 1111 관련 상담입니다." }, now).ok).toBe(false);
    expect(validateConsultation({ ...validInput, message: "인증서 비밀번호: secret-value" }, now).ok).toBe(false);
  });

  it("rejects forms submitted too quickly", () => {
    expect(validateConsultation({ ...validInput, startedAt: now - 200 }, now).ok).toBe(false);
  });
});

describe("csrf tokens", () => {
  const secret = "csrf-test-secret-that-is-longer-than-32-characters";

  it("accepts a fresh token and rejects tampering or expiry", () => {
    const token = issueCsrfToken(secret, now);
    expect(verifyCsrfToken(token, secret, now + 1_000)).toBe(true);
    expect(verifyCsrfToken(`${token}x`, secret, now + 1_000)).toBe(false);
    expect(verifyCsrfToken(token, secret, now + 31 * 60 * 1_000)).toBe(false);
  });
});

describe("consultation encryption", () => {
  const key = Buffer.alloc(32, 7).toString("base64");

  it("round-trips data and detects ciphertext changes", () => {
    const encrypted = encryptConsultation({ name: "홍길동", phone: "010-0000-0000" }, key, "test-v1");
    expect(encrypted.ciphertext).not.toContain("홍길동");
    expect(decryptConsultation(encrypted, key)).toEqual({ name: "홍길동", phone: "010-0000-0000" });

    const tampered = { ...encrypted, ciphertext: `${encrypted.ciphertext.slice(0, -2)}AA` };
    expect(() => decryptConsultation(tampered, key)).toThrow();
  });
});
