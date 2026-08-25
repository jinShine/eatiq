/**
 * 백엔드 서버 부재(2026-08-24 확인: eatiqlink-dev.onrender.com 전체 404) 중
 * UI 작업을 이어가기 위한 목 데이터.
 *
 * 새 백엔드 URL·스펙이 오면 `NEXT_PUBLIC_USE_MOCK`을 끄고 이 파일을 삭제한다.
 * 타입은 실제 DTO(`brand.type.ts`)를 그대로 쓰므로, 스펙이 바뀌면 타입 에러로 드러난다.
 */
import { type BrandSettings, type PageResponseBrandSummary } from "./brand.type";

/** 목 설정에서 폼이 저장하는 섹션들 */
type MockSettingsSection =
  | "brand"
  | "brandIntro"
  | "brandOperation"
  | "brandContact"
  | "brandContract"
  | "brandPolicy"
  | "brandFee"
  | "brandAreaCriteria";

/** 목 워크스페이스 id — URL의 [workspaceId]로 쓰인다 */
export const MOCK_WORKSPACE_ID = "mock-workspace-1";

export const mockBrandsPage: PageResponseBrandSummary = {
  content: [
    { id: MOCK_WORKSPACE_ID, nameKo: "몽탄", nameEn: "MONGTAN", role: "owner" },
    { id: "mock-workspace-2", nameKo: "금돼지식당", nameEn: "GEUMDWAEJI", role: "user" },
  ],
  page: 0,
  size: 20,
  totalElements: 2,
  totalPages: 1,
  hasNext: false,
};

export const mockBrandSettings: BrandSettings = {
  brand: {
    nameKo: "몽탄",
    nameEn: "MONGTAN",
    launchYear: 2019,
    ceoNameKo: "김대표",
    ceoNameEn: "Kim",
    hqEmail: "hq@mongtan.co.kr",
    hqWebsite: "https://mongtan.co.kr",
    hqAddress: "서울특별시 용산구 백범로99길 50",
  },
  brandIntro: {
    oneLiner: "숯불에 구운 우대갈비 전문점",
    description: "한국식 숯불 직화 구이를 대표하는 브랜드입니다.",
    category: "korean_food",
    pricePositioning: "premium",
    differentiator1: "우대갈비 시그니처 메뉴",
    differentiator2: "짚불 직화 조리법",
    differentiator3: "웨이팅 문화 브랜딩",
  },
  brandOperation: {
    storeCountTotalDomestic: 3,
    storeCountDirect: 3,
    storeCountOverseas: 0,
    monthlyRevenueAvg: 42000000, // 원(KRW) raw — 4,200만원
    avgStoreSizePy: 60, // 평
    avgSpendPerPerson: 45000,
    avgSeatCount: 48,
  },
  brandContact: {
    contactNameKo: "이담당",
    contactNameEn: "Lee",
    contactTitle: "해외사업팀장",
    contactEmail: "global@mongtan.co.kr",
    contactLanguages: ["ko", "en"],
  },
  brandType: "franchise",
  completionRates: {
    basicInfo: { rate: 62, stage: "IN_PROGRESS" },
    brandVisual: { rate: 0, stage: "EMPTY" },
    contractPolicy: { rate: 25, stage: "IN_PROGRESS" },
    tradeAreaCriteria: { rate: 0, stage: "EMPTY" },
  },
  journeys: {
    basicInfo: {
      scope: "BRAND_TAB",
      scopeKey: "BRAND_BASIC",
      journeyStage: "IN_PROGRESS",
      completionRate: 62,
      nextStageRemaining: 3,
      gateReason: "NONE",
      missingItems: [
        {
          key: "hqWebsite",
          label: "공식 웹사이트",
          section: "basic",
          isRequired: false,
          sortOrder: 1,
          targetScreen: "BRAND-01",
          targetTab: "basic",
          targetAnchor: "hqWebsite",
        },
        {
          key: "targetCustomers",
          label: "주요 고객층",
          section: "operation",
          isRequired: true,
          sortOrder: 2,
          targetScreen: "BRAND-01",
          targetTab: "basic",
          targetAnchor: "targetCustomers",
        },
        {
          key: "usageOccasions",
          label: "이용 상황",
          section: "operation",
          isRequired: true,
          sortOrder: 3,
          targetScreen: "BRAND-01",
          targetTab: "basic",
          targetAnchor: "usageOccasions",
        },
      ],
      nextAction: {
        label: "주요 고객층 입력",
        targetScreen: "BRAND-01",
        targetTab: "basic",
        targetAnchor: "targetCustomers",
      },
    },
    brandVisual: {
      scope: "BRAND_TAB",
      scopeKey: "BRAND_VISUAL",
      journeyStage: "EMPTY",
      completionRate: 0,
      nextStageRemaining: 8,
      gateReason: "NONE",
      missingItems: [],
    },
    contractPolicy: {
      scope: "BRAND_TAB",
      scopeKey: "BRAND_CONTRACT",
      journeyStage: "IN_PROGRESS",
      completionRate: 25,
      nextStageRemaining: 6,
      gateReason: "NONE",
      missingItems: [],
    },
    tradeAreaCriteria: {
      scope: "BRAND_TAB",
      scopeKey: "BRAND_AREA",
      journeyStage: "EMPTY",
      completionRate: 0,
      nextStageRemaining: 5,
      gateReason: "NONE",
      missingItems: [],
    },
  },
};

/**
 * 목 저장 — 실제 서버처럼 값이 유지되도록 목 설정에 병합한다.
 * (완성률·journeys는 서버 계산 영역이라 목에서는 갱신되지 않는다)
 */
export const mergeMockSettings = (section: MockSettingsSection, patch: object) => {
  mockBrandSettings[section] = {
    ...(mockBrandSettings[section] ?? {}),
    ...patch,
  } as BrandSettings[typeof section];
};
