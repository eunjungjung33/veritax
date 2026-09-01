export const navItems = [
  { label: "소개", to: "/about" },
  { label: "업무영역", to: "/services" },
  { label: "특별 서비스", to: "/special-services" },
  { label: "세무 인사이트", to: "/insights" },
  { label: "수행 경험", to: "/cases" },
  { label: "간편 견적", to: "/estimate" },
  { label: "오시는 길", to: "/location" },
] as const;

export const services = [
  {
    number: "01",
    title: "종합소득세 신고",
    short: "개인사업자·프리랜서·임대소득",
    description:
      "소득 구조와 증빙을 먼저 정리하고 적용 가능한 공제·감면을 검토해 신고 이후의 리스크까지 관리합니다.",
    bullets: ["소득 유형별 신고", "필요경비 검토", "절세 플랜 수립"],
  },
  {
    number: "02",
    title: "법인세 신고",
    short: "결산부터 세무조정까지",
    description:
      "법인 결산과 세무조정계산서 작성, 신고 사후관리까지 기업의 일정에 맞춰 일관된 흐름으로 진행합니다.",
    bullets: ["법인 결산", "세무조정", "신고 사후관리"],
  },
  {
    number: "03",
    title: "부가가치세",
    short: "일반·간이과세자 신고",
    description:
      "매입·매출 자료를 구조화하고 누락과 중복을 점검해 정확한 신고와 적정 환급을 돕습니다.",
    bullets: ["과세 유형 검토", "매입세액 점검", "환급 검토"],
  },
  {
    number: "04",
    title: "양도소득세",
    short: "부동산·주식 양도",
    description:
      "거래 전 예상 세액과 비과세·감면 요건을 검토하고, 거래 후 신고까지 연결합니다.",
    bullets: ["사전 세액 검토", "비과세 요건", "양도세 신고"],
  },
  {
    number: "05",
    title: "상속·증여세",
    short: "재산 평가와 이전 설계",
    description:
      "재산 구성과 가족 상황을 함께 살펴 신고, 평가, 사전 증여 전략을 균형 있게 설계합니다.",
    bullets: ["상속재산 평가", "증여 계획", "신고 대행"],
  },
  {
    number: "06",
    title: "세무 컨설팅",
    short: "조사·불복·경정청구·실사",
    description:
      "복잡한 사실관계와 세법 쟁점을 문서와 수치로 정리해 의사결정 가능한 해법을 제시합니다.",
    bullets: ["세무조사 대응", "경정청구", "세무진단·실사"],
  },
  {
    number: "07",
    title: "기장 대리",
    short: "매월 쌓이는 정확한 장부",
    description:
      "월별 장부, 급여세무, 4대보험을 한 흐름으로 관리해 경영자가 숫자를 제때 확인하도록 돕습니다.",
    bullets: ["월별 장부", "급여세무", "4대보험 관리"],
  },
  {
    number: "08",
    title: "비상장주식평가",
    short: "거래·증여·승계를 위한 가치평가",
    description:
      "평가 목적과 회사 특성을 반영해 자료를 검증하고 세무상 쟁점을 함께 점검합니다.",
    bullets: ["보충적 평가", "거래가액 검토", "평가 보고"],
  },
  {
    number: "09",
    title: "창업 세무 컨설팅",
    short: "사업 시작부터 세무 구조 설계",
    description:
      "사업자 등록, 법인 전환, 인건비와 초기 증빙 체계를 시작 단계부터 설계합니다.",
    bullets: ["사업자 등록", "법인 전환 검토", "초기 세무 체계"],
  },
] as const;

export const specialServices = [
  {
    eyebrow: "TAX CONTROVERSY",
    title: "세무조사·불복 원스톱 대응",
    description:
      "자료 요청 대응부터 쟁점 정리, 과세 전 적부심·이의신청·심판청구까지 사건의 전체 흐름을 관리합니다.",
    items: ["초기 리스크 진단", "사실관계·증빙 구조화", "조사 대응 의견서", "불복 절차 지원"],
  },
  {
    eyebrow: "FAMILY OFFICE",
    title: "상속·증여·가업승계",
    description:
      "가족과 기업의 자산을 함께 바라보고 이전 시점, 평가, 납세 재원을 종합적으로 검토합니다.",
    items: ["상속세 예상세액", "사전 증여 시뮬레이션", "비상장주식 평가", "가업승계 세무"],
  },
  {
    eyebrow: "CORPORATE ADVISORY",
    title: "기업 세무·재무 자문",
    description:
      "투자·조직개편·지분거래 등 중요한 의사결정 전에 세무와 회계 영향을 먼저 점검합니다.",
    items: ["세무진단·실사", "조직개편 세무", "투자·지분거래 검토", "재무·회계 자문"],
  },
  {
    eyebrow: "STARTUP DESK",
    title: "스타트업 성장 데스크",
    description:
      "창업기업관리사 자격과 현장 멘토 경험을 바탕으로 설립 이후 성장 단계별 세무 이슈를 관리합니다.",
    items: ["초기 증빙 체계", "인건비·스톡옵션", "투자 전 재무 점검", "정책지원 세무 자문"],
  },
] as const;

export type InsightCategory = "전체" | "신고" | "기업" | "자산" | "창업";

export const insightCategories: InsightCategory[] = ["전체", "신고", "기업", "자산", "창업"];

export const insights = [
  {
    category: "신고" as InsightCategory,
    date: "2026.08.24",
    title: "부가가치세 신고 전에 확인할 증빙 7가지",
    summary: "매입세액 공제 누락과 불필요한 소명 요청을 줄이는 기본 점검표입니다.",
  },
  {
    category: "기업" as InsightCategory,
    date: "2026.08.07",
    title: "법인 결산은 신고 직전이 아니라 매월 준비해야 합니다",
    summary: "월 마감 품질이 법인세 신고와 경영 의사결정에 미치는 영향을 정리했습니다.",
  },
  {
    category: "자산" as InsightCategory,
    date: "2026.07.18",
    title: "상속·증여 계획에서 비상장주식 평가가 중요한 이유",
    summary: "평가 기준일과 회사의 재무상태가 세액에 미치는 핵심 변수를 살펴봅니다.",
  },
  {
    category: "창업" as InsightCategory,
    date: "2026.07.02",
    title: "개인사업자와 법인, 세금만 보고 고르면 안 되는 이유",
    summary: "책임, 자금 조달, 비용 구조까지 함께 판단해야 하는 체크포인트입니다.",
  },
  {
    category: "기업" as InsightCategory,
    date: "2026.06.16",
    title: "세무조사 연락을 받은 날 가장 먼저 해야 할 일",
    summary: "자료를 제출하기 전에 조사 범위와 사실관계를 정리하는 순서를 안내합니다.",
  },
  {
    category: "신고" as InsightCategory,
    date: "2026.05.09",
    title: "종합소득세 신고 자료, 어떻게 준비하면 빠를까요?",
    summary: "소득 유형별로 미리 모아두면 좋은 자료와 증빙을 한눈에 정리했습니다.",
  },
] as const;

export const caseStudies = [
  {
    category: "회계감사",
    title: "호텔·제조업 등 주요 법인 회계감사 수행",
    client: "신라호텔·코오롱 등",
    description: "업종별 거래 구조와 내부 프로세스를 이해하고 핵심 계정과 증빙을 검토한 경험을 보유하고 있습니다.",
  },
  {
    category: "법인세",
    title: "대형 법인 법인세 신고·경정청구",
    client: "SK하이닉스·현대자동차 등",
    description: "대규모 법인의 복잡한 세무조정과 쟁점 검토, 경정청구 업무를 수행했습니다.",
  },
  {
    category: "가치평가",
    title: "국내외 비상장주식 가치평가",
    client: "아모레퍼시픽 해외자회사 등",
    description: "지분거래와 세무 목적에 맞춰 재무자료와 평가 변수를 분석한 경험을 보유하고 있습니다.",
  },
  {
    category: "조세대응",
    title: "세무조사·경정청구·세무진단",
    client: "법인 및 고액자산가",
    description: "사실관계와 세법 쟁점을 명확히 구조화해 조사와 사후 절차를 지원합니다.",
  },
] as const;

export const faqs = [
  {
    question: "상담 신청 후 언제 연락을 받을 수 있나요?",
    answer: "평일 운영시간 기준으로 접수 순서에 따라 확인합니다. 긴급한 신고기한이 있다면 상담 내용에 날짜를 적어 주세요.",
  },
  {
    question: "첫 상담 전에 어떤 자료를 준비해야 하나요?",
    answer: "상담 신청 단계에서는 민감한 서류를 받지 않습니다. 담당자가 사안을 확인한 뒤 필요한 자료와 안전한 전달 방법을 별도로 안내합니다.",
  },
  {
    question: "상담 신청서에 주민등록번호를 적어도 되나요?",
    answer: "아니요. 주민등록번호, 계좌 비밀번호, 카드번호, 인증서 비밀번호 등 고유식별정보와 비밀정보는 절대 입력하지 마세요.",
  },
  {
    question: "비대면 상담도 가능한가요?",
    answer: "사안과 자료 범위에 따라 전화 또는 화상 상담이 가능합니다. 원하는 연락 방식을 선택해 주세요.",
  },
] as const;

export const serviceOptions = services.map((service) => service.title);
