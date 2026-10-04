/**
 * 브랜드 정보 설정 화면이 쓰는 뷰 타입.
 *
 * 새 백엔드는 필드가 snake_case로 바뀌고 섹션이 13개로 쪼개져서
 * 화면 구조와 1:1로 맞지 않는다. 화면을 한 번에 갈아엎지 않기 위해
 * 기존 화면 구조를 이 타입으로 고정해 두고, 실제 API 매핑은 뒤에서 한다.
 *
 * 기본 정보 탭(기본 정보·소개·운영 현황·연락처)은 실제 API(Brand*DataDto)로 옮겨 여기서 뺐다.
 * TODO(API): 남은 탭(계약 및 정책·상권분석 기준)도 옮기면 이 파일을 삭제한다.
 */

/** 계약 담당자·서명자 — 새 백엔드에서는 contract 하나로 합쳐졌다 */
export type BrandContractView = {
  contractContactNameKo?: string;
  contractContactNameEn?: string;
  contractContactTitle?: string;
  contractContactEmail?: string;
  signatoryNameKo?: string;
  signatoryNameEn?: string;
  signatoryTitle?: string;
  signatoryEmail?: string;
};

/** 계약 정책 */
export type BrandPolicyView = {
  preferredContractType?: string;
  exclusivity?: string;
  menuLocalization?: string;
  interiorCompliance?: string;
  ingredientSupply?: string;
  /** 기획 회신 기준 boolean(예/아니오/미설정) */
  ingredientSupplyRequired?: boolean;
  trademark?: string;
  manualCompliance?: string;
};

/** 수수료 — 새 백엔드의 commission */
export type BrandFeeView = {
  franchiseFeeKrw?: number | null;
  royaltyBase?: string;
  royaltyRatePct?: number | null;
  royaltyFixedKrw?: number | null;
  paymentCycle?: string;
};

/** 상권분석 기준 — 새 백엔드에서는 location-standard·size-criteria·facility-req 셋으로 나뉜다 */
export type BrandAreaCriteriaView = {
  sizeMinPy?: number | null;
  sizeMaxPy?: number | null;
  rentMinKrw?: number | null;
  rentMaxKrw?: number | null;
  recommendedSizePy?: number | null;
  minFrontageM?: number | null;
  allowableFloor?: string;
  preferredArea1st?: string;
  preferredArea2nd?: string;
  preferredArea3rd?: string;
  signageImportance?: string;
  storeSizeImportance?: string;
  parkingImportance?: string;
  waitingSpaceImportance?: string;
  lunchSalesImportance?: string;
  latenightSalesImportance?: string;
  weekdaySalesImportance?: string;
  weekendSalesImportance?: string;
  gasImportance?: string;
  waterImportance?: string;
  openFlameImportance?: string;
  ventilationImportance?: string;
  refrigerationImportance?: string;
};

export type BrandSettingsView = {
  brandContract?: BrandContractView;
  brandPolicy?: BrandPolicyView;
  brandFee?: BrandFeeView;
  brandAreaCriteria?: BrandAreaCriteriaView;
  brandType?: string;
};
