export const KAKAO_CHANNEL_URL = "http://pf.kakao.com/_xixixabX";
export const PHONE_NUMBER = "02-6426-1654";
export const PHONE_HREF = "tel:0264261654";

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
  "(전) 삼정회계법인 택스본부",
  "(전) 서현회계법인 택스본부",
  "(현) 한국창업멘토협회 전문 멘토",
  "(현) 한국여성공인회계사회 이사",
  "(현) 창업진흥원 원스탑 지원센터 자문위원",
  "(현) 노란우산공제 경영지원단",
  "(현) 서산문화재단 감사직",
] as const;

export const principalIntro = [
  "안녕하세요. '정은정 세무회계컨설팅'의 대표 정은정입니다.",
  "회계는 숫자를 기록하는 일이 아니라, 대표님의 선택을 돕는 일이라고 생각합니다.\n회계법인 감사본부와 택스본부를 거치며 SK하이닉스 법인세 세무조정, 아모레퍼시픽 비상장주식 가치평가 등 대기업 세무 업무를 담당했고, 그 경험에서 좋은 회계는 과거를 정리하는 일이 아니라 미래를 설계하는 일임을 배웠습니다.\n세금 신고는 누구나 할 수 있지만, 사업의 중요한 의사결정은 숫자를 아는 전문가와 함께해야 합니다.",
  "대표님은 사업에 집중하세요. 저는 숫자로 길을 찾아드리겠습니다.",
] as const;

export const principalLectures = [
  { title: "인건비 세무관리 및 절세 꿀팁", host: "HRD 클럽" },
  { title: "창업 초기 대표가 꼭 알아야 할 절세 체크리스트", host: "그로스캠퍼스" },
  { title: "학원 원장님들을 위한 세무 가이드", host: "천재교육 본사" },
  { title: "청소년 회계교육 '미래와 회계' 강의", host: "한국공인회계사회 주관" },
  { title: "창업기업의 세무회계", host: "한국창업멘토협회" },
  { title: "'청소년을 위한 회계교육' 강의", host: "수원시평생학습관" },
  { title: "신규 사업자를 위한 세무회계 강의", host: "수원시평생학습관" },
  { title: "그 외 스타트업 및 예비 창업자 대상 비즈니스 세무회계 실무 강의 다수", host: "" },
] as const;

export const metrics = [
  { value: "Big4", label: "출신 공인회계사" },
  { value: "SK · 현대", label: "대기업 법인세 담당" },
  { value: "99%", label: "기장대리 재계약률" },
  { value: "300건", label: "연중 신규상담 건수" },
] as const;

export const principalDuties = [
  "회계감사 — 신라호텔, 코오롱 등",
  "법인세 신고 대리 및 경정청구 — SK하이닉스, 현대자동차 등",
  "비상장주식 평가 — 아모레퍼시픽 외 해외 자회사 등",
  "세무조사 대응, 경정청구, 세무 진단, 세무 실사 등 세무 관련 용역",
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
    description: "일반·간이과세자 부가세 신고 대행, 환급 극대화 전략 수립",
  },
  {
    number: "04",
    title: "법인 설립 컨설팅",
    description: "법인 설립 절차 지원, 설립 전후 세무·회계 설계",
  },
  {
    number: "05",
    title: "세무 컨설팅",
    description: "경정청구, 절세 컨설팅, 세무 진단, 세무조사 대응, 불복청구 등 전문 세무 용역",
  },
  {
    number: "06",
    title: "기장 대리",
    description: "월별 장부 작성, 인건비 신고, 4대보험 관리까지 전반적인 기장 서비스",
  },
] as const;

export const consultationOptions = [
  ...services.map((service) => service.title),
  "양도소득세 신고",
  "상속·증여세 신고",
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
