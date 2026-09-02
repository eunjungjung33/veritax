import { describe, expect, it } from "vitest";
import { KAKAO_CHANNEL_URL, navItems, PHONE_HREF, services } from "../src/data/content";
import { validateConsultation } from "../netlify/functions/_lib/validation";

describe("v2 website brief", () => {
  it("keeps the confirmed global navigation order and contact links", () => {
    expect(navItems.map((item) => item.label)).toEqual([
      "홈",
      "구성원",
      "주요 업무영역",
      "견적",
      "세무 뉴스",
      "찾아오시는 길",
    ]);
    expect(KAKAO_CHANNEL_URL).toBe("http://pf.kakao.com/_xixixabX");
    expect(PHONE_HREF).toBe("tel:0264261654");
  });

  it("publishes only the nine confirmed practice areas", () => {
    expect(services.map((service) => service.title)).toEqual([
      "종합소득세 신고",
      "법인세 신고",
      "부가가치세 신고",
      "법인 설립 컨설팅",
      "세무 컨설팅",
      "기장 대리",
      "비상장주식평가",
      "창업 세무 컨설팅",
      "가상자산 세무",
    ]);
    expect(services.map((service) => service.number)).toEqual(["01", "02", "03", "05", "06", "07", "08", "09", "10"]);
  });

  it("accepts every published practice area in the consultation API", () => {
    const now = Date.UTC(2026, 8, 3, 12, 0, 0);
    for (const service of services) {
      expect(validateConsultation({
        service: service.title,
        name: "홍길동",
        phone: "010-1234-5678",
        email: "",
        contactPreference: "phone",
        message: "상담 가능한 일정을 확인하고 싶습니다.",
        website: "",
        consent: true,
        startedAt: now - 5_000,
      }, now).ok).toBe(true);
    }
  });
});
