import { type BrandAreaCriteria, type UpdateAreaCriteriaRequest } from "@services/api/brand/brand.type";

// /area-criteria 는 전체 치환이라, 카드 하나를 저장할 때도 나머지 필드를 함께 보내야 유실되지 않는다.
export const mergeAreaCriteria = (
  current: BrandAreaCriteria | undefined,
  patch: UpdateAreaCriteriaRequest,
): UpdateAreaCriteriaRequest => ({
  preferredArea1st: current?.preferredArea1st ?? "",
  preferredArea2nd: current?.preferredArea2nd ?? "",
  preferredArea3rd: current?.preferredArea3rd ?? "",
  rentMinKrw: current?.rentMinKrw ?? undefined,
  rentMaxKrw: current?.rentMaxKrw ?? undefined,
  allowableFloor: current?.allowableFloor ?? "",
  signageImportance: current?.signageImportance ?? "",
  storeSizeImportance: current?.storeSizeImportance ?? "",
  parkingImportance: current?.parkingImportance ?? "",
  waitingSpaceImportance: current?.waitingSpaceImportance ?? "",
  lunchSalesImportance: current?.lunchSalesImportance ?? "",
  latenightSalesImportance: current?.latenightSalesImportance ?? "",
  weekdaySalesImportance: current?.weekdaySalesImportance ?? "",
  weekendSalesImportance: current?.weekendSalesImportance ?? "",
  recommendedSizePy: current?.recommendedSizePy ?? undefined,
  sizeMinPy: current?.sizeMinPy ?? undefined,
  sizeMaxPy: current?.sizeMaxPy ?? undefined,
  minFrontageM: current?.minFrontageM ?? undefined,
  gasImportance: current?.gasImportance ?? "",
  waterImportance: current?.waterImportance ?? "",
  openFlameImportance: current?.openFlameImportance ?? "",
  ventilationImportance: current?.ventilationImportance ?? "",
  refrigerationImportance: current?.refrigerationImportance ?? "",
  ...patch,
});

export const toText = (v?: number | null) => (v === null || v === undefined ? "" : String(v));
export const toNumber = (v: string) => (v ? Number(v) : undefined);
