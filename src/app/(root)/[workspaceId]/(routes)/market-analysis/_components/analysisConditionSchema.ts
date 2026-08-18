import z from "zod";

const numberField = z.string().refine(v => !v || /^\d+$/.test(v), { message: "숫자만 입력해주세요" });

// TODO(API): 상권 분석 실행 API가 나오면 요청 스키마에 맞춰 키를 조정한다
export const analysisConditionSchema = z.object({
  // 필수 조건 탭
  country: z.string().min(1, "분석 국가를 선택해주세요"),
  city: z.string().min(1, "분석 도시를 선택해주세요"),
  sizeMinPy: numberField, // 평형 최소 (평)
  sizeMaxPy: numberField, // 평형 최대 (평)
  rentMinKrw: numberField, // 임대료 최소 (월/KRW)
  rentMaxKrw: numberField, // 임대료 최대 (월/KRW)
  allowableFloor: z.string(), // 허용 층수 · floor_type

  // 상세 조건 탭 — 회사 정보 설정의 area-criteria와 같은 코드값
  preferredArea1st: z.string(), // 선호 상권 1순위 · area_type
  preferredArea2nd: z.string(),
  preferredArea3rd: z.string(),
  signageImportance: z.string(), // 간판 노출 중요도 · importance_level
  storeSizeImportance: z.string(), // 매장 노출 중요도
  parkingImportance: z.string(), // 주차 필요 여부
  waitingSpaceImportance: z.string(), // 대기공간 필요 여부
  lunchSalesImportance: z.string(), // 점심 매출 중요도
  dinnerSalesImportance: z.string(), // 저녁 매출 중요도 · TODO(백엔드) area-criteria는 latenight(심야)인데 화면은 저녁이다
  weekdaySalesImportance: z.string(), // 주중 매출 중요도
  weekendSalesImportance: z.string(), // 주말 매출 중요도
});

export type AnalysisConditionFormValues = z.infer<typeof analysisConditionSchema>;

export const EMPTY_CONDITION: AnalysisConditionFormValues = {
  country: "",
  city: "",
  sizeMinPy: "",
  sizeMaxPy: "",
  rentMinKrw: "",
  rentMaxKrw: "",
  allowableFloor: "",
  preferredArea1st: "",
  preferredArea2nd: "",
  preferredArea3rd: "",
  signageImportance: "",
  storeSizeImportance: "",
  parkingImportance: "",
  waitingSpaceImportance: "",
  lunchSalesImportance: "",
  dinnerSalesImportance: "",
  weekdaySalesImportance: "",
  weekendSalesImportance: "",
};
