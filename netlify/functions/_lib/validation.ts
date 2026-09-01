import { containsHighlySensitiveData } from "../../../src/utils/sensitiveData.js";

export const MAX_BODY_BYTES = 16_384;

const SERVICE_OPTIONS = new Set([
  "종합소득세 신고",
  "법인세 신고",
  "부가가치세",
  "양도소득세",
  "상속·증여세",
  "세무 컨설팅",
  "기장 대리",
  "비상장주식평가",
  "창업 세무 컨설팅",
  "기타 상담",
]);

const BIDI_CONTROL = /[\u202A-\u202E\u2066-\u2069]/u;
const INVALID_CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

export type ConsultationPayload = {
  service: string;
  name: string;
  phone: string;
  email: string | null;
  contactPreference: "phone" | "email";
  message: string;
};

export type ValidationResult =
  | { ok: true; value: ConsultationPayload; isSpam: false }
  | { ok: true; isSpam: true }
  | { ok: false; message: string };

function text(value: unknown, preserveLines = false) {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFKC").trim();
  if (BIDI_CONTROL.test(normalized) || INVALID_CONTROL.test(normalized)) return null;
  return preserveLines
    ? normalized.replace(/\r\n?/gu, "\n").replace(/[ \t]+/gu, " ").replace(/\n{3,}/gu, "\n\n")
    : normalized.replace(/\s+/gu, " ");
}

export function validateConsultation(input: unknown, now = Date.now()): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, message: "입력 내용을 확인해 주세요." };
  }

  const body = input as Record<string, unknown>;
  const website = text(body.website);
  if (website) return { ok: true, isSpam: true };

  const startedAt = typeof body.startedAt === "number" ? body.startedAt : Number.NaN;
  if (!Number.isFinite(startedAt) || startedAt > now || now - startedAt < 1_200 || now - startedAt > 2 * 60 * 60 * 1000) {
    return { ok: false, message: "페이지를 새로고침한 뒤 다시 작성해 주세요." };
  }

  const service = text(body.service);
  const name = text(body.name);
  const phone = text(body.phone);
  const email = text(body.email);
  const message = text(body.message, true);
  const contactPreference = body.contactPreference;

  if (!service || !SERVICE_OPTIONS.has(service)) return { ok: false, message: "상담 분야를 선택해 주세요." };
  if (!name || name.length < 2 || name.length > 60) return { ok: false, message: "성함을 확인해 주세요." };
  if (!phone || phone.length > 20 || !/^\+?[0-9()\-\s]{8,20}$/u.test(phone)) return { ok: false, message: "연락처를 확인해 주세요." };

  const phoneDigits = phone.replace(/\D/gu, "");
  if (phoneDigits.length < 8 || phoneDigits.length > 15) return { ok: false, message: "연락처를 확인해 주세요." };
  if (email && (email.length > 120 || !EMAIL_PATTERN.test(email))) return { ok: false, message: "이메일 주소를 확인해 주세요." };
  if (contactPreference !== "phone" && contactPreference !== "email") return { ok: false, message: "연락 방식을 선택해 주세요." };
  if (contactPreference === "email" && !email) return { ok: false, message: "이메일 연락을 원하면 이메일 주소를 입력해 주세요." };
  if (!message || message.length < 10 || message.length > 1_500) return { ok: false, message: "상담 내용은 10자 이상 1,500자 이하로 입력해 주세요." };
  if (containsHighlySensitiveData(message)) {
    return { ok: false, message: "상담 내용에서 주민등록번호, 카드번호 또는 비밀번호로 보이는 값을 삭제해 주세요." };
  }
  if (body.consent !== true) return { ok: false, message: "개인정보 수집·이용 동의가 필요합니다." };

  return {
    ok: true,
    isSpam: false,
    value: {
      service,
      name,
      phone,
      email: email || null,
      contactPreference,
      message,
    },
  };
}
