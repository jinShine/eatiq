// TODO(API): 바이어 탐색 목록 API가 준비되면 이 파일을 삭제하고 useQuery로 교체한다.
// 코드값(countryCode·category·contractType)은 진행 관리와 같은 임시값을 쓴다.

export type BuyerRow = {
  id: string;
  /** 회사명 — 아바타 이니셜은 이 값의 첫 글자를 쓴다 */
  name: string;
  /** 한 줄 소개 */
  summary: string;
  /** 운영 중인 브랜드명 */
  operatingBrands: string[];
  /** 규모·이력 메타 — "초대형 운영사 · 브랜드 8개 · 매장 500 ~ 1,000개" */
  scaleLabel: string;
  /** 한국 브랜드 운영 이력 — 있으면 메타 끝에 강조 표시된다 */
  hasKoreanBrandExperience: boolean;
  /** 조건 부합 바이어일 때만 노출되는 추천 사유 */
  matchReason?: string;
  /** 외부 링크(회사 홈페이지) */
  websiteUrl?: string;

  // 필터용 코드값
  countryCode: string;
  category: string;
  contractType: string;
};

export const BUYER_MOCK: BuyerRow[] = [
  {
    id: "buyer-watami",
    name: "Watami CO.",
    summary: "Subway Japan을 인수하고 bb.q 치킨을 운영하는 상장 외식 운영사",
    operatingBrands: ["Subway Japan", "bb.q Japan"],
    scaleLabel: "초대형 운영사 · 브랜드 8개 · 매장 500 ~ 1,000개",
    hasKoreanBrandExperience: true,
    matchReason: "한국 치킨 브랜드를 이미 운영 중이고, 진출 희망 국가와 운영 지역이 일치합니다.",
    websiteUrl: "https://www.watami.co.jp",
    countryCode: "JP",
    category: "korean_food",
    contractType: "master_franchise",
  },
  {
    id: "buyer-colowide",
    name: "Colowide Co.",
    summary: "야키니쿠, 회전초밥 등 20여개 브랜드를 운영하는 상장 외식 그룹",
    operatingBrands: ["牛角", "かっぱ寿司"],
    scaleLabel: "초대형 운영사 · 브랜드 20개 · 매장 1,000개 이상",
    hasKoreanBrandExperience: true,
    websiteUrl: "https://www.colowide.co.jp",
    countryCode: "JP",
    category: "beef_bbq",
    contractType: "master_franchise",
  },
  {
    id: "buyer-zensho",
    name: "Zensho Holdings",
    summary: "규동, 회전초밥을 운영하는 일본 최대 외식 그룹",
    operatingBrands: ["すき家", "はま寿司 외 12개"],
    scaleLabel: "중형 운영사 · 브랜드 2개 · 매장 500 ~ 1,000개",
    hasKoreanBrandExperience: false,
    websiteUrl: "https://www.zensho.co.jp",
    countryCode: "JP",
    category: "korean_food",
    contractType: "direct",
  },
  {
    id: "buyer-uns",
    name: "un.s Inc.",
    summary: "한국 '사위식당'의 일본 마스터 프랜차이즈 파트너",
    operatingBrands: ["사위식당"],
    scaleLabel: "초대형 운영사 · 브랜드 8개 · 매장 500 ~ 1,000개",
    hasKoreanBrandExperience: false,
    countryCode: "JP",
    category: "korean_food",
    contractType: "master_franchise",
  },
  {
    id: "buyer-food-and-life",
    name: "Food & Life Companies",
    summary: "스시로를 운영하는 일본 최대 회전초밥 기업",
    operatingBrands: ["スシロー", "杉玉"],
    scaleLabel: "초대형 운영사 · 브랜드 5개 · 매장 1,000개 이상",
    hasKoreanBrandExperience: false,
    websiteUrl: "https://www.food-and-life.co.jp",
    countryCode: "JP",
    category: "korean_food",
    contractType: "master_franchise",
  },
  {
    id: "buyer-jollibee",
    name: "Jollibee Foods",
    summary: "동남아 전역에 다브랜드 포트폴리오를 운영하는 상장 외식 그룹",
    operatingBrands: ["Jollibee", "Chowking"],
    scaleLabel: "초대형 운영사 · 브랜드 15개 · 매장 1,000개 이상",
    hasKoreanBrandExperience: true,
    matchReason: "동남아 다국가 운영 경험이 있고, 희망 계약 방식이 마스터 프랜차이즈로 일치합니다.",
    websiteUrl: "https://www.jollibeefoods.com",
    countryCode: "SG",
    category: "korean_food",
    contractType: "master_franchise",
  },
];
