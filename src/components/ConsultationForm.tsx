import { FormEvent, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { serviceOptions } from "../data/content";
import { containsHighlySensitiveData } from "../utils/sensitiveData";
import { ArrowRight, Check, Lock } from "./Icons";

type FormState = {
  service: string;
  name: string;
  phone: string;
  email: string;
  contactPreference: "phone" | "email";
  message: string;
  website: string;
  consent: boolean;
};

const emptyForm: FormState = {
  service: "",
  name: "",
  phone: "",
  email: "",
  contactPreference: "phone",
  message: "",
  website: "",
  consent: false,
};

async function readJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function ConsultationForm() {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") ?? "";
  const initialService = (serviceOptions as readonly string[]).includes(requestedService) ? requestedService : "";
  const freshForm = (): FormState => ({ ...emptyForm, service: initialService });
  const [form, setForm] = useState<FormState>(freshForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [receiptId, setReceiptId] = useState("");
  const startedAt = useRef(Date.now());

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      setStatus("error");
      setMessage("필수 항목과 입력 형식을 확인해 주세요.");
      return;
    }

    if (form.contactPreference === "email" && !form.email.trim()) {
      setStatus("error");
      setMessage("이메일 연락을 원하면 이메일 주소를 입력해 주세요.");
      return;
    }

    if (containsHighlySensitiveData(form.message)) {
      setStatus("error");
      setMessage("상담 내용에서 주민등록번호, 카드번호 또는 비밀번호로 보이는 값을 삭제해 주세요.");
      return;
    }

    setStatus("sending");
    setMessage("보안 토큰을 확인하고 있습니다.");

    try {
      const csrfResponse = await fetch("/api/csrf", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
        redirect: "error",
        referrerPolicy: "no-referrer",
        headers: { Accept: "application/json" },
      });
      const csrfBody = await readJson(csrfResponse);
      const token = typeof csrfBody.token === "string" ? csrfBody.token : "";

      if (!csrfResponse.ok || !token) {
        throw new Error("csrf_unavailable");
      }

      setMessage("암호화해 접수하고 있습니다.");
      const response = await fetch("/api/consultations", {
        method: "POST",
        cache: "no-store",
        credentials: "same-origin",
        redirect: "error",
        referrerPolicy: "no-referrer",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ ...form, startedAt: startedAt.current }),
      });
      const body = await readJson(response);

      if (!response.ok) {
        const safeMessage = typeof body.message === "string" ? body.message : "접수하지 못했습니다. 잠시 후 다시 시도해 주세요.";
        setStatus("error");
        setMessage(safeMessage);
        return;
      }

      const receipt = typeof body.receiptId === "string" ? body.receiptId : "접수 완료";
      setReceiptId(receipt);
      setForm(freshForm());
      startedAt.current = Date.now();
      setStatus("success");
      setMessage("상담 신청이 안전하게 접수되었습니다.");
    } catch {
      setStatus("error");
      setMessage("보안 연결을 확인할 수 없습니다. 잠시 후 다시 시도하거나 대표번호로 연락해 주세요.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <span className="success-icon"><Check size={30} /></span>
        <span className="eyebrow">RECEIVED SECURELY</span>
        <h2>접수되었습니다.</h2>
        <p>접수번호 <strong>{receiptId}</strong></p>
        <p>신청서 원문은 화면과 브라우저 저장소에 남기지 않았습니다. 평일 운영시간에 담당자가 확인합니다.</p>
        <button className="button button-outline" type="button" onClick={() => setStatus("idle")}>새 상담 작성</button>
      </div>
    );
  }

  return (
    <form className="consultation-form" onSubmit={submit} noValidate autoComplete="off">
      <div className="form-security-note">
        <Lock />
        <div>
          <strong>첫 상담에는 최소 정보만 수집합니다.</strong>
          <p>주민등록번호, 계좌·카드 번호, 비밀번호, 인증서 정보, 원본 세무서류는 입력하지 마세요.</p>
        </div>
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">웹사이트</label>
        <input
          id="website"
          name="website"
          type="text"
          value={form.website}
          onChange={(event) => update("website", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="field full-field">
        <label htmlFor="service">상담 분야 <span>필수</span></label>
        <select id="service" name="service" required value={form.service} onChange={(event) => update("service", event.target.value)}>
          <option value="">분야를 선택해 주세요</option>
          {serviceOptions.map((service) => <option key={service} value={service}>{service}</option>)}
          <option value="기타 상담">기타 상담</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="name">성함 <span>필수</span></label>
        <input id="name" name="name" required minLength={2} maxLength={60} autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="홍길동" />
      </div>
      <div className="field">
        <label htmlFor="phone">연락처 <span>필수</span></label>
        <input id="phone" name="phone" type="tel" inputMode="tel" required maxLength={20} autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="010-0000-0000" />
      </div>
      <div className="field">
        <label htmlFor="email">이메일 <small>선택</small></label>
        <input id="email" name="email" type="email" maxLength={120} autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="name@example.com" />
      </div>
      <fieldset className="field contact-choice">
        <legend>선호 연락 방식</legend>
        <label><input type="radio" name="contactPreference" value="phone" checked={form.contactPreference === "phone"} onChange={() => update("contactPreference", "phone")} /> 전화</label>
        <label><input type="radio" name="contactPreference" value="email" checked={form.contactPreference === "email"} onChange={() => update("contactPreference", "email")} /> 이메일</label>
      </fieldset>

      <div className="field full-field">
        <label htmlFor="message">상담 내용 <span>필수</span></label>
        <textarea id="message" name="message" required minLength={10} maxLength={1500} autoComplete="off" value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="신고 기한과 궁금한 점을 중심으로 간단히 적어 주세요. 민감한 번호나 비밀번호는 입력하지 마세요." />
        <small className="character-count">{form.message.length} / 1,500</small>
      </div>

      <label className="consent-check full-field">
        <input type="checkbox" required checked={form.consent} onChange={(event) => update("consent", event.target.checked)} />
        <span><strong>개인정보 수집·이용에 동의합니다.</strong> 상담 확인을 위해 성함·연락처·상담 내용을 90일간 암호화 보관하는 데 동의합니다. <a href="/privacy" target="_blank" rel="noopener">자세히 보기</a></span>
      </label>

      {message && <p className={`form-status ${status === "error" ? "is-error" : ""}`} aria-live="polite">{message}</p>}

      <button className="submit-button full-field" type="submit" disabled={status === "sending"}>
        <span>{status === "sending" ? "안전하게 접수 중" : "상담 신청하기"}</span>
        <ArrowRight />
      </button>
      <p className="form-footnote full-field">이 페이지는 외부 설문, 광고 픽셀, 방문 분석 도구를 사용하지 않습니다.</p>
    </form>
  );
}
