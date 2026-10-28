import { type BrandDetail, type BrandListItem } from "@services/api/brand/brand.type";

import { toExternalUrl } from "@utils/functions";

import { CATEGORY_VALUES } from "../../company-settings/_components/sections/IntroOptions";
import { CONTRACT_TYPE_VALUES, TARGET_COUNTRY_VALUES } from "../../company-settings/_components/sections/policyOptions";

/************************************
 * 브랜드 탐색 화면의 뷰모델 — API 응답(DTO)을 화면까지 흘려보내지 않는다
 ************************************/

/** 목록 카드 하나 */
export type BrandCardView = {
  /** 브랜드 식별자(uid) — 상세 조회에 쓴다. 워크스페이스 id가 아니다 */
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
  intro: string | null;
  /** 「2015년 론칭 · 국내 18개 매장 · 고가 브랜드」 — 서버가 문구째 준다 */
  meta: string | null;
  signatureMenu: string | null;
  contractType: string | null;
};

/** 라벨 - 값 한 줄. 값이 없으면 시안대로 "-" */
export type DetailRow = {
  label: string;
  value: string | null;
};

export type BrandDetailView = {
  id: string;
  name: string;
  initial: string;
  imageUrl: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  meta: string | null;
  shortIntro: string | null;
  detailIntro: string | null;
  /** 해외 매장 수 — API는 국가별이 아니라 합계만 준다 */
  overseasStoreCount: number | null;
  targetCountries: string[];
  partnershipTerms: DetailRow[];
  facts: DetailRow[];
};

export const toBrandCard = (item: BrandListItem): BrandCardView => ({
  id: String(item.uid),
  name: item.brand_name_ko,
  category: item.category,
  imageUrl: item.featured_image,
  intro: item.short_intro,
  meta: item.meta_text,
  signatureMenu: item.rep_menu_name_ko,
  contractType: item.preferred_contract_type,
});

/** ISO 일시 → 「2026. 09. 16」 (시안의 정보 확인 일자 형식) */
const toDateText = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}`;
};

export const toBrandDetailView = (detail: BrandDetail): BrandDetailView => {
  const terms = detail.partnership_conditions;

  return {
    id: String(detail.uid),
    name: detail.brand_name_ko,
    initial: detail.brand_name_ko.trim().charAt(0).toUpperCase(),
    imageUrl: detail.featured_image,
    logoUrl: detail.logo_image,
    websiteUrl: toExternalUrl(detail.homepage_url),
    meta: detail.meta_text,
    shortIntro: detail.short_intro,
    detailIntro: detail.detail_intro,
    overseasStoreCount: detail.overseas_store_total_cnt,
    targetCountries: detail.target_country ?? [],
    // 시안의 라벨·순서 그대로 (피그마 961:11038). 상표·매뉴얼 기준은 시안에 없어 보여주지 않는다
    partnershipTerms: [
      { label: "희망 계약 방식", value: terms?.preferred_contract_type ?? null },
      { label: "독점권 요구", value: terms?.exclusivity_level ?? null },
      { label: "메뉴 현지화", value: terms?.menu_localization ?? null },
      { label: "로열티 선호", value: terms?.royalty ?? null },
      { label: "식자재 공급", value: terms?.supply_chain ?? null },
      { label: "인테리어 기준", value: terms?.interior_criteria ?? null },
    ],
    // 시안의 「회사 소개」 표는 바이어 항목(사업 유형·본사 위치 등)이라 API에 있는 브랜드 값으로 채운다(디자인 확인 요청)
    facts: [
      { label: "카테고리", value: detail.category },
      { label: "런칭 연도", value: detail.launch_year !== null ? `${detail.launch_year}년` : null },
      { label: "가격 포지션", value: detail.price_positioning },
      { label: "정보 확인 일자", value: toDateText(detail.updated_time) },
    ],
  };
};

/************************************
 * 필터 선택지 — 「전체」는 FilterChip이 앞에 붙인다(값 "" = 필터 없음)
 *
 * 서버는 선택지를 내려주지 않는다(스펙 설명의 filter_options는 실제 응답에 없음 — 백엔드 확인 요청).
 * 브랜드가 저장하는 값과 같아야 걸리므로 회사 정보 설정의 선택지를 그대로 쓴다.
 ************************************/
export const COUNTRY_FILTER_OPTIONS = TARGET_COUNTRY_VALUES.map(value => ({ value, label: value }));
export const CATEGORY_FILTER_OPTIONS = CATEGORY_VALUES.map(value => ({ value, label: value }));
export const CONTRACT_TYPE_FILTER_OPTIONS = CONTRACT_TYPE_VALUES.map(value => ({ value, label: value }));
