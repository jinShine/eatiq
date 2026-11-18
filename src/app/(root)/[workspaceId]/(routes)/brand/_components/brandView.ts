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

/** 대표 메뉴 카드 하나 */
export type MenuView = {
  key: string;
  name: string;
  nameEn: string | null;
  /** 「9,900원」 — 가격이 없으면 null */
  priceText: string | null;
  description: string | null;
  imageUrl: string | null;
};

/** 연도별 막대 하나 — 값이 없는 해는 목록에서 뺀다 */
export type YearBar = {
  year: number;
  value: number;
  /** 막대 위 숫자 — 「3,508만」 · 「169」 */
  label: string;
};

export type SalesView = {
  latestYear: number;
  /** 가맹점 연평균 매출 「4억 2,096만 원」 — 기획 변경(11-18)으로 월평균 대신 연평균 */
  annualSalesText: string | null;
  /** 3.3㎡당 연 매출 「797만 원」 — 0이나 없음이면 null */
  salesPerAreaText: string | null;
  bars: YearBar[];
};

export type FranchiseView = {
  latestYear: number;
  franchiseCount: number | null;
  directCount: number | null;
  bars: YearBar[];
  /** 최근 연도 계약 현황 — 없으면 null */
  contract: { year: number; newOpen: number; contractEnd: number; contractCancel: number } | null;
};

export type ExternalLinkView = { kind: "homepage" | "instagram" | "youtube"; label: string; url: string };

export type BrandDetailView = {
  id: string;
  name: string;
  initial: string;
  imageUrl: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  meta: string | null;
  shortIntro: string | null;
  menus: MenuView[];
  storeImages: string[];
  sales: SalesView | null;
  franchise: FranchiseView | null;
  targetCountries: string[];
  partnershipTerms: DetailRow[];
  links: ExternalLinkView[];
  /** 정보 출처 — 서버가 비워 두면 null(출처를 지어내지 않는다) */
  infoSource: string | null;
  /** 「2026. 10. 20」 — 상세 응답의 수정 시각 */
  checkedDate: string | null;
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

/** 원 → 「3,508만」 · 「1억 5,068만」 (만 원 단위 반올림). 1억이 넘으면 억을 따로 적어 자릿수를 세지 않게 한다 */
const toManwon = (won: number) => {
  const manwon = Math.round(won / 10_000);
  const eok = Math.floor(manwon / 10_000);
  const rest = manwon % 10_000;
  if (eok === 0) {
    return `${rest.toLocaleString()}만`;
  }
  return rest === 0 ? `${eok.toLocaleString()}억` : `${eok.toLocaleString()}억 ${rest.toLocaleString()}만`;
};

/** 0은 「입력 안 됨」으로 본다 — 서버가 빈 값을 0으로 보내는 해가 있다(유가네 2021 sales_per_area) */
const positive = (value: number | null | undefined) => (value && value > 0 ? value : null);

const toSalesView = (summary: BrandDetail["sales_summary"]): SalesView | null => {
  if (!summary?.latest_year) {
    return null;
  }
  // 요약에는 최근 연도의 월평균만 있어서, 연평균은 연도 목록에서 최근 연도를 찾아 쓴다
  const annual = positive(summary.yearly_sales.find(item => item.year === summary.latest_year)?.avg_annual_sales);
  const perArea = positive(summary.sales_per_area);
  return {
    latestYear: summary.latest_year,
    annualSalesText: annual ? `${toManwon(annual)} 원` : null,
    salesPerAreaText: perArea ? `${toManwon(perArea)} 원` : null,
    bars: summary.yearly_sales
      .filter(item => positive(item.avg_annual_sales))
      .map(item => ({ year: item.year, value: item.avg_annual_sales, label: toManwon(item.avg_annual_sales) })),
  };
};

const toFranchiseView = (summary: BrandDetail["franchise_summary"]): FranchiseView | null => {
  if (!summary?.latest_year) {
    return null;
  }
  const latestContract = summary.contract_status.find(item => item.year === summary.latest_year);
  return {
    latestYear: summary.latest_year,
    franchiseCount: summary.franchise_count,
    directCount: summary.direct_count,
    bars: summary.yearly_franchise_counts
      .filter(item => positive(item.franchise_count))
      .map(item => ({ year: item.year, value: item.franchise_count, label: item.franchise_count.toLocaleString() })),
    contract: latestContract
      ? {
          year: latestContract.year,
          newOpen: latestContract.new_open,
          contractEnd: latestContract.contract_end,
          contractCancel: latestContract.contract_cancel,
        }
      : null,
  };
};

const toLinks = (links: BrandDetail["external_links"]): ExternalLinkView[] => {
  const candidates: [ExternalLinkView["kind"], string, string | null][] = [
    ["homepage", "홈페이지", links.homepage_url],
    ["instagram", "인스타그램", links.instagram_url],
    ["youtube", "유튜브", links.youtube_url],
  ];
  return candidates.flatMap(([kind, label, raw]) => {
    const url = toExternalUrl(raw);
    return url ? [{ kind, label, url }] : [];
  });
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
    menus: detail.signature_menus
      .filter(menu => menu.name_ko)
      .map((menu, index) => ({
        key: `${index}-${menu.name_ko}`,
        name: menu.name_ko ?? "",
        nameEn: menu.name_en,
        priceText: menu.price !== null ? `${menu.price.toLocaleString()}원` : null,
        description: menu.explain,
        imageUrl: menu.image_url ?? menu.image_list[0] ?? null,
      })),
    storeImages: detail.store_image_list,
    sales: toSalesView(detail.sales_summary),
    franchise: toFranchiseView(detail.franchise_summary),
    targetCountries: detail.target_country ?? [],
    // 시안 v2의 라벨·순서 그대로 (피그마 2072:4921). 「파트너 역할」은 API에 없어 뺀다
    partnershipTerms: [
      { label: "희망 계약 방식", value: terms?.preferred_contract_type ?? null },
      { label: "메뉴 현지화", value: terms?.menu_localization ?? null },
      { label: "식자재 공급", value: terms?.supply_chain ?? null },
      { label: "인테리어 기준", value: terms?.interior_criteria ?? null },
    ],
    links: toLinks(detail.external_links),
    infoSource: detail.info_source,
    checkedDate: toDateText(detail.updated_time),
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
