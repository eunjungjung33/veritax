export const feeServices = [
  { id: "종합소득세", label: "종합소득세 신고", consultationService: "종합소득세 신고" },
  { id: "법인세", label: "법인세 신고", consultationService: "법인세 신고" },
  { id: "부가세", label: "부가가치세 신고", consultationService: "부가가치세 신고" },
  { id: "양도세", label: "양도소득세 신고", consultationService: "양도소득세 신고" },
  { id: "상속증여", label: "상속·증여세 신고", consultationService: "상속·증여세 신고" },
  { id: "기장", label: "기장 대리 (월)", consultationService: "기장 대리" },
  { id: "컨설팅", label: "세무 컨설팅", consultationService: "세무 컨설팅" },
] as const;

export const feeScales = [
  { id: "1", label: "1억 미만" },
  { id: "5", label: "1억~5억" },
  { id: "10", label: "5억~10억" },
  { id: "50", label: "10억~50억" },
  { id: "100", label: "50억 이상" },
] as const;

type FeeServiceId = (typeof feeServices)[number]["id"];
type FeeScaleId = (typeof feeScales)[number]["id"];

const feeTable: Record<FeeServiceId, Record<FeeScaleId, number>> = {
  종합소득세: { "1": 150_000, "5": 250_000, "10": 400_000, "50": 700_000, "100": 1_200_000 },
  법인세: { "1": 300_000, "5": 500_000, "10": 800_000, "50": 1_500_000, "100": 3_000_000 },
  부가세: { "1": 100_000, "5": 200_000, "10": 350_000, "50": 600_000, "100": 1_000_000 },
  양도세: { "1": 200_000, "5": 350_000, "10": 600_000, "50": 1_000_000, "100": 2_000_000 },
  상속증여: { "1": 500_000, "5": 800_000, "10": 1_500_000, "50": 3_000_000, "100": 5_000_000 },
  기장: { "1": 100_000, "5": 200_000, "10": 350_000, "50": 600_000, "100": 1_000_000 },
  컨설팅: { "1": 200_000, "5": 300_000, "10": 500_000, "50": 800_000, "100": 1_500_000 },
};

export function estimateFee(service: string, scale: string) {
  const validService = feeServices.some((item) => item.id === service);
  const validScale = feeScales.some((item) => item.id === scale);
  if (!validService || !validScale) return null;
  return feeTable[service as FeeServiceId][scale as FeeScaleId];
}

export function consultationServiceFor(service: string) {
  return feeServices.find((item) => item.id === service)?.consultationService ?? "";
}

export function feeServiceForConsultation(service: string) {
  return feeServices.find((item) => item.consultationService === service)?.id ?? "";
}
