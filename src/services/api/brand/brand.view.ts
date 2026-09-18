/**
 * 브랜드 정보 설정 화면이 쓰는 뷰 타입.
 *
 * 새 백엔드는 필드가 snake_case로 바뀌고 섹션이 13개로 쪼개져서
 * 화면 구조와 1:1로 맞지 않는다. 화면을 한 번에 갈아엎지 않기 위해
 * 기존 화면 구조를 이 타입으로 고정해 두고, 실제 API 매핑은 뒤에서 한다.
 *
 * TODO(API): 섹션별 매핑이 확정되면 brand.type.ts의 DTO로 교체하고 이 파일을 삭제한다.
 *   - nameKo → brand_name_ko, hqEmail → official_email, hqWebsite → homepage_url
 *   - oneLiner → short_intro, description → detail_intro, differentiator1~3 → key_point[]
 *   - storeCountTotalDomestic → domestic_store_total_cnt, monthlyRevenueAvg → avg_monthly_sales
 *   - contactNameKo → name_ko, contactTitle → position, contactEmail → email
 */

export type BrandBasicView = {
  nameKo?: string;
  nameEn?: string;
  launchYear?: number;
  ceoNameKo?: string;
  ceoNameEn?: string;
  hqEmail?: string;
  hqWebsite?: string;
  hqAddress?: string;
};

export type BrandIntroView = {
  oneLiner?: string;
  description?: string;
  category?: string;
  pricePositioning?: string;
  differentiator1?: string;
  differentiator2?: string;
  differentiator3?: string;
};

export type BrandOperationView = {
  storeCountTotalDomestic?: number;
  storeCountDirect?: number;
  storeCountOverseas?: number;
  monthlyRevenueAvg?: number;
  avgStoreSizePy?: number;
  avgSpendPerPerson?: number;
  avgSeatCount?: number;
  targetCustomers?: string[];
  usageOccasions?: string[];
};

export type BrandContactView = {
  contactNameKo?: string;
  contactNameEn?: string;
  contactTitle?: string;
  contactEmail?: string;
  contactLanguages?: string[];
};

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

/** 완성 현황 — 백엔드 미개발 항목이라 당분간 목 데이터로만 채워진다 */
export type MissingItemView = {
  key?: string;
  label?: string;
  section?: string;
  isRequired?: boolean;
  sortOrder?: number;
  targetScreen?: string;
  targetTab?: string;
  targetAnchor?: string;
};

export type NextActionView = {
  label?: string;
  targetScreen?: string;
  targetTab?: string;
  targetAnchor?: string;
};

export type JourneyView = {
  scope?: string;
  scopeKey?: string;
  journeyStage?: string;
  completionRate?: number;
  nextStageRemaining?: number;
  gateReason?: string;
  gateMessage?: string;
  missingItems?: MissingItemView[];
  benefits?: { itemKey?: string; benefitText?: string; label?: string }[];
  nextAction?: NextActionView;
};

export type RateStageView = {
  rate?: number;
  stage?: string;
};

export type BrandSettingsView = {
  brand?: BrandBasicView;
  brandIntro?: BrandIntroView;
  brandOperation?: BrandOperationView;
  brandContact?: BrandContactView;
  brandContract?: BrandContractView;
  brandPolicy?: BrandPolicyView;
  brandFee?: BrandFeeView;
  brandAreaCriteria?: BrandAreaCriteriaView;
  brandType?: string;
  completionRates?: Record<string, RateStageView>;
  journeys?: Record<string, JourneyView>;
};
