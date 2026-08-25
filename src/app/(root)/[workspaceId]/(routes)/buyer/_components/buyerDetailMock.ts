// TODO(API): 바이어 상세 조회 API가 준비되면 이 파일을 삭제하고 useQuery로 교체한다.

/** 라벨 - 값 한 줄 (파트너십 선호 조건 · 회사 소개 공용) */
export type DetailRow = {
  label: string;
  /** 값이 없으면 시안처럼 "-"로 표시한다 */
  value: string | null;
};

export type BuyerDetail = {
  id: string;
  /** 우리 브랜드와 잘 맞는 이유 */
  matchReasons: string[];
  /** 확인이 필요한 조건 — 제목 + "바이어 : … | 귀사 : …" 대비 */
  checkPoints: { title: string; comparison: string }[];
  /** 주요 운영 브랜드 카드 */
  operatingBrands: { name: string; meta: string; source: string }[];
  /** 파트너십 선호 조건 */
  partnershipTerms: DetailRow[];
  /** 회사 소개 본문 */
  intro: string;
  /** 회사 소개 표 */
  companyFacts: DetailRow[];
};

const WATAMI_DETAIL: BuyerDetail = {
  id: "buyer-watami",
  matchReasons: ["일본 시장 진출 의향이 일치", "마스터 프랜차이즈 운영 경험 확인", "다점포 운영 역량 확인"],
  checkPoints: [
    { title: "독점권 조건 협의", comparison: "바이어 : 독점필수 | 귀사 : 협의 가능" },
    { title: "식자재 공급 조건 협의", comparison: "바이어 : 자체 공급 가능 | 귀사 : 본사 공급 필요" },
  ],
  operatingBrands: [
    { name: "서브웨이 재팬", meta: "마스터 프랜차이즈 · 매장 12개 · 2016년 시작", source: "공개 자료에서 확인" },
    { name: "bbq 재팬", meta: "마스터 프랜차이즈 · 매장 18개 · 2021년 시작", source: "공개 자료에서 확인" },
  ],
  partnershipTerms: [
    { label: "희망 계약 방식", value: "마스터 프랜차이즈" },
    { label: "선호 브랜드 가격대", value: "중가 (1~3만원) 이상" },
    { label: "독점권 요구", value: "필수" },
    { label: "메뉴 현지화", value: "일부 허용" },
    { label: "로열티 선호", value: null },
    { label: "식자재 공급", value: "자체 공급 가능" },
    { label: "인테리어 기준", value: null },
  ],
  intro:
    "Watami CO.는 2008년 설립된 일본의 다브랜드 외식 운영사입니다. 일본 전역에서 마스터 프랜차이즈 방식으로 외식 브랜드를 운영하며 현재 4개 브랜드, 38개 매장을 운영하고 있습니다.",
  companyFacts: [
    { label: "사업 유형", value: "마스터 프랜차이즈 운영사" },
    { label: "설립 연도", value: "2008년" },
    { label: "본사 위치", value: "일본 도쿄" },
    { label: "주요 운영 국가", value: "일본" },
    { label: "주요 운영 업종", value: "외식 F&B" },
    { label: "정보 확인 일자", value: "2026. 08. 12" },
  ],
};

/**
 * 상세 목업.
 * 아직 Watami 한 건만 실제 시안 값이고, 나머지는 같은 형태를 재사용한다.
 */
export const BUYER_DETAIL_MOCK: Record<string, BuyerDetail> = {
  [WATAMI_DETAIL.id]: WATAMI_DETAIL,
};

/** 상세 목업이 없는 바이어는 시안 구조를 유지한 기본값으로 채운다 */
export const buildFallbackDetail = (buyerId: string): BuyerDetail => ({
  ...WATAMI_DETAIL,
  id: buyerId,
});
