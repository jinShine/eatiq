import { type BuyerDetailResponse, type BuyerListItem } from "@services/api/buyer/buyer.type";

import {
  BUSINESS_TYPE_OPTIONS,
  CONTRACT_TYPE_VALUES,
  OPERATING_COUNTRY_VALUES,
} from "../../company-settings/_components/buyer/buyerOptions";

/************************************
 * 바이어 탐색 화면의 뷰모델 — API 응답(DTO)을 화면까지 흘려보내지 않는다
 ************************************/

/** 목록 카드 한 줄 */
export type BuyerCardView = {
  /** 바이어 식별자(uid) — 상세 조회에 쓴다. 워크스페이스 id가 아니다 */
  id: string;
  name: string;
  initial: string;
  /** 한 줄 소개 */
  summary: string | null;
  /** 「운영 브랜드 : …」 — 서버가 문구째 준다 */
  brandSummary: string | null;
  /** 「브랜드 8개 · 매장 500~1,000개」 — 서버가 문구째 준다 */
  meta: string | null;
  hasKoreanBrandExperience: boolean;
  websiteUrl: string | null;
};

/** 라벨 - 값 한 줄. 값이 없으면 시안대로 "-" */
export type DetailRow = {
  label: string;
  value: string | null;
};

export type BuyerDetailView = {
  id: string;
  name: string;
  initial: string;
  websiteUrl: string | null;
  brandSummary: string | null;
  operatingBrands: { name: string; meta: string; source: string | null }[];
  partnershipTerms: DetailRow[];
  intro: string | null;
  companyFacts: DetailRow[];
};

/** 회사명 첫 글자 — 목록 응답에는 이니셜이 없다(상세에는 있다) */
const toInitial = (name: string) => name.trim().charAt(0).toUpperCase();

/** 사업 유형 — 코드값이면 한국어 이름으로, 예전 자유 문구면 그대로 */
export const toBusinessTypeLabel = (value: string | null) =>
  BUSINESS_TYPE_OPTIONS.find(option => option.value === value)?.label ?? value;

export const toBuyerCard = (item: BuyerListItem): BuyerCardView => ({
  id: String(item.uid),
  name: item.company_name,
  initial: toInitial(item.company_name),
  summary: item.detail_intro,
  brandSummary: item.brand_summary,
  meta: item.meta_text,
  hasKoreanBrandExperience: item.korean_brand_experience === true,
  websiteUrl: item.homepage_url,
});

/** 운영 브랜드 메타 — 있는 값만 이어 붙인다: 「마스터 프랜차이즈 · 매장 12개 · 2016년 시작」 */
const toBrandMeta = (brand: BuyerDetailResponse["brands"][number]) =>
  [
    brand.contract_type,
    brand.store_count !== null ? `매장 ${brand.store_count.toLocaleString()}개` : null,
    brand.started_year !== null ? `${brand.started_year}년 시작` : null,
  ]
    .filter(Boolean)
    .join(" · ");

export const toBuyerDetailView = (detail: BuyerDetailResponse): BuyerDetailView => ({
  id: String(detail.uid),
  name: detail.company_name,
  initial: detail.initial || toInitial(detail.company_name),
  websiteUrl: detail.homepage_url,
  brandSummary: detail.brand_summary,
  operatingBrands: detail.brands.map(brand => ({
    name: brand.brand_name,
    meta: toBrandMeta(brand),
    source: brand.source,
  })),
  // 시안의 라벨·순서 그대로 (피그마 961:11467)
  partnershipTerms: [
    { label: "희망 계약 방식", value: detail.contract_policy.preferred_contract_type },
    { label: "선호 브랜드 가격대", value: detail.contract_policy.target_price_tier },
    { label: "독점권 요구", value: detail.contract_policy.exclusivity_requirement },
    { label: "메뉴 현지화", value: detail.contract_policy.localization_requirement },
    { label: "로열티 선호", value: detail.contract_policy.preferred_royalty_type },
    { label: "식자재 공급", value: detail.contract_policy.has_supply_chain },
    { label: "인테리어 기준", value: detail.contract_policy.interior_preference },
  ],
  intro: detail.basic_info.detail_intro,
  companyFacts: [
    { label: "사업 유형", value: toBusinessTypeLabel(detail.basic_info.business_type) },
    {
      label: "설립 연도",
      value: detail.basic_info.founded_year !== null ? `${detail.basic_info.founded_year}년` : null,
    },
    { label: "본사 위치", value: detail.basic_info.headquarter_location },
    { label: "주요 운영 국가", value: detail.basic_info.country },
    { label: "주요 운영 업종", value: detail.basic_info.target_industry },
    { label: "정보 확인 일자", value: detail.basic_info.verified_at },
  ],
});

/************************************
 * 필터 선택지 — 「전체」는 FilterChip이 앞에 붙인다(값 "" = 필터 없음)
 *
 * TODO(백엔드): 목록 응답에 filterOptions가 오면 그걸로 바꾼다(스펙 설명에는 있는데 응답에 없음).
 * 그 전까지는 회사 정보 설정과 같은 선택지를 쓴다.
 ************************************/
export const COUNTRY_FILTER_OPTIONS = OPERATING_COUNTRY_VALUES.map(value => ({ value, label: value }));
export const CATEGORY_FILTER_OPTIONS = BUSINESS_TYPE_OPTIONS.map(option => ({ ...option }));
export const CONTRACT_TYPE_FILTER_OPTIONS = CONTRACT_TYPE_VALUES.map(value => ({ value, label: value }));
