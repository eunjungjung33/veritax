export const KAKAO_CHANNEL_URL = "http://pf.kakao.com/_xixixabX";
export const PHONE_NUMBER = "02-6426-1654";
export const PHONE_HREF = "tel:0264261654";
export const NAVER_BLOG_URL = "https://blog.naver.com/taxabc119";

export const navItems = [
  { label: "홈", to: "/" },
  {
    label: "구성원",
    to: "/about",
    children: [
      { label: "대표", to: "/about#principal" },
      { label: "고문", to: "/about#adviser" },
    ],
  },
  { label: "주요 업무영역", to: "/services" },
  { label: "견적", to: "/estimate" },
  { label: "세무 뉴스", to: "/insights" },
  { label: "찾아오시는 길", to: "/location" },
] as const;

export const principalCareers = [
  "(전) 한영회계법인 감사본부",
  "(전) 삼정회계법인택스본부",
  "(전) 서현회계법인 택스본부",
  "(현) 한국창업멘토협회전문멘토",
  "(현) 한국여성공인회계사회 이사",
  "(현) 창업진흥원 원스탑 지원센터 자문위원",
  "(현) 노란우산공제 경영지원단",
  "(현) 서산문화재단 감사직",
] as const;

export const principalDuties = [
  "회계감사 — 신라호텔, 코오롱 등",
  "법인세 신고대리 및 경정청구 — SK하이닉스, 현대자동차 등",
  "비상장주식평가 — 아모레퍼시픽 외 해외자회사 등",
  "세무조사 대응, 경정청구, 세무진단, 세무실사 등 세무 관련 용역",
] as const;

export const adviserCareers = [
  "(현) 한국창업멘토협회 부회장",
  "(전) 국세청 감사원",
  "(전) 삼일회계법인 고문",
] as const;

export const services = [
  {
    number: "01",
    title: "종합소득세 신고",
    description: "개인사업자·프리랜서·임대소득 등 종합소득세 신고 및 절세 플랜 수립",
  },
  {
    number: "02",
    title: "법인세 신고",
    description: "법인 결산, 법인세 신고, 세무조정계산서 작성 등 법인 세무 전반 대행",
  },
  {
    number: "03",
    title: "부가가치세 신고",
    description: "일반·간이과세자 부가세 신고대행, 환급 극대화 전략 수립",
  },
  {
    number: "05",
    title: "법인 설립 컨설팅",
    description: "법인 설립 절차 지원, 설립 전후 세무·회계 설계",
  },
  {
    number: "06",
    title: "세무 컨설팅",
    description: "경정청구, 절세컨설팅, 세무진단, 세무조사 대응, 불복청구 등 전문 세무 용역",
  },
  {
    number: "07",
    title: "기장 대리",
    description: "월별 장부 작성, 급여세무, 4대보험 관리까지 전반적인 기장 서비스",
  },
  {
    number: "08",
    title: "비상장주식평가",
    description: "비상장주식 가치평가, 해외자회사·아모레퍼시픽 등 다수 실적 보유",
  },
  {
    number: "09",
    title: "창업 세무 컨설팅",
    description: "창업기업관리사 자격 보유, 창업 절차·사업자 등록·초기 세무 전략",
  },
  {
    number: "10",
    title: "가상자산 세무",
    description: "가상자산 거래 관련 소득세·신고 의무, 과세 리스크 진단",
  },
] as const;

export const consultationOptions = [
  ...services.map((service) => service.title),
  "양도소득세 신고",
  "상속·증여세 신고",
] as const;

export const insights = [
  {
    date: "2026.08.28",
    category: "법인세",
    title: "임원에게 제공한 사택, 정말 비과세일까(소득세 법인세 과세이슈)",
    summary: "임원 사택 제공 시 소득세와 법인세에서 확인해야 할 과세 기준을 살펴봅니다.",
    href: "https://blog.naver.com/taxabc119/224393704543",
  },
  {
    date: "2026.08.14",
    category: "창업",
    title: "창업중소기업 세액감면 vs 창업벤처감면, 어떤 게 유리할까?",
    summary: "두 감면 제도의 선택 조건과 적용 전에 확인할 핵심 차이를 정리합니다.",
    href: "https://blog.naver.com/taxabc119/224378372233",
  },
  {
    date: "2026.08.07",
    category: "세무자문",
    title: "세무자문 미팅을 다녀왔습니다. (외국인 택스 자문)",
    summary: "외국계 법인 세무자문 현장에서 다룬 업무의 흐름과 경험을 전합니다.",
    href: "https://blog.naver.com/taxabc119/224371590203",
  },
  {
    date: "2026.07.30",
    category: "창업",
    title: "사업자등록증에 해당 업종이 없어도 창업중소기업세액감면 가능할까?",
    summary: "사업자등록증의 형식과 실제 영위 업종이 다를 때의 감면 판단 기준을 설명합니다.",
    href: "https://blog.naver.com/taxabc119/224362297214",
  },
] as const;

export const faqs = [
  {
    question: "예상 보수와 실제 보수가 달라질 수 있나요?",
    answer: "네. 계산 결과는 기본 참고 금액이며, 자료 상태와 거래 건수, 업무 범위를 확인한 뒤 최종 보수를 안내합니다.",
  },
  {
    question: "상담 신청 후 언제 연락을 받을 수 있나요?",
    answer: "평일 운영시간 기준으로 접수 순서에 따라 확인합니다. 신고기한이 임박한 경우 문의 사항에 날짜를 적어 주세요.",
  },
  {
    question: "상담 신청서에 세무서류를 첨부해도 되나요?",
    answer: "첫 상담 단계에서는 원본 서류를 받지 않습니다. 담당자가 사안을 확인한 뒤 안전한 자료 전달 방법을 안내합니다.",
  },
] as const;
