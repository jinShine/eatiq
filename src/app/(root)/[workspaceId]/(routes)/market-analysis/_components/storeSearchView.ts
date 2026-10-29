import dayjs from "dayjs";

import {
  type StoreListing,
  type StoreSearchAreaUnit,
  type StoreSearchFloor,
  type StoreSearchListItem,
} from "@services/api/store-search/store-search.type";

import { toExternalUrl } from "@utils/functions/validate";

type Option = { value: string; label: string };

export const EMPTY_CELL = "—";

/** 목록·리포트·로딩 화면이 같은 머리말을 쓴다 */
export const STORE_SEARCH_TITLE = "상가 매물 탐색";
export const STORE_SEARCH_DESCRIPTION = "국가·도시와 매장 조건을 입력해 알맞은 상가 매물을 탐색합니다.";

/************************************
 * 선택지 — 서버는 한국어 이름을 그대로 받는다(「일본」·「도쿄」)
 ************************************/

/**
 * 국가는 설계 노트(961:12500)의 매물 수집 국가 4곳.
 * TODO(API): 지원 국가·도시 목록 API가 없어 화면에 둔다. 도시는 스펙 예시(도쿄·오사카·후쿠오카·홍콩)를 따른다
 */
export const STORE_SEARCH_COUNTRY_OPTIONS: Option[] = [
  { value: "일본", label: "일본" },
  { value: "홍콩", label: "홍콩" },
  { value: "싱가포르", label: "싱가포르" },
  { value: "태국", label: "태국" },
];

export const STORE_SEARCH_CITY_OPTIONS: Record<string, Option[]> = {
  일본: [
    { value: "도쿄", label: "도쿄" },
    { value: "오사카", label: "오사카" },
    { value: "후쿠오카", label: "후쿠오카" },
  ],
  홍콩: [{ value: "홍콩", label: "홍콩" }],
  싱가포르: [{ value: "싱가포르", label: "싱가포르" }],
  태국: [{ value: "방콕", label: "방콕" }],
};

/** 모든 국가의 도시 — 목록 필터에서 국가를 고르지 않았을 때 쓴다 */
export const ALL_CITY_OPTIONS: Option[] = Object.values(STORE_SEARCH_CITY_OPTIONS).flat();

/** 층수를 고르지 않으면 보내지 않는다(전체). Radix Select는 빈 문자열 값을 쓸 수 없어 따로 둔다 */
export const ANY_FLOOR = "any";

export const FLOOR_OPTIONS: { value: StoreSearchFloor | typeof ANY_FLOOR; label: string }[] = [
  { value: ANY_FLOOR, label: "전체" },
  { value: "지하1층", label: "지하 1층" },
  { value: "1층", label: "1층" },
  { value: "2층", label: "2층" },
  { value: "그외", label: "그 외 층" },
];

/** 목록 필터 「탐색 기간」 — 서버는 시작·종료일을 받는다. 종료일은 오늘 */
export const PERIOD_OPTIONS: Option[] = [
  { value: "1w", label: "최근 1주" },
  { value: "1m", label: "최근 1개월" },
  { value: "3m", label: "최근 3개월" },
  { value: "6m", label: "최근 6개월" },
];

const PERIOD_START: Record<string, () => dayjs.Dayjs> = {
  "1w": () => dayjs().subtract(1, "week"),
  "1m": () => dayjs().subtract(1, "month"),
  "3m": () => dayjs().subtract(3, "month"),
  "6m": () => dayjs().subtract(6, "month"),
};

export const toPeriodRange = (period: string) => {
  const start = PERIOD_START[period];
  if (!start) {
    return { start_date: undefined, end_date: undefined };
  }
  return { start_date: start().format("YYYY-MM-DD"), end_date: dayjs().format("YYYY-MM-DD") };
};

/************************************
 * 표시 형식
 ************************************/

/** 「40~60 평형」 · 한쪽만 있으면 「40평 이상」/「60평 이하」 */
export const formatAreaRange = (min: number | null, max: number | null, unit: StoreSearchAreaUnit | null): string => {
  const suffix = unit === "m2" ? "㎡" : "평";
  if (min !== null && max !== null) {
    return unit === "m2" ? `${min}~${max}㎡` : `${min}~${max} 평형`;
  }
  if (min !== null) {
    return `${min}${suffix} 이상`;
  }
  if (max !== null) {
    return `${max}${suffix} 이하`;
  }
  return EMPTY_CELL;
};

/** 원화는 시안처럼 만원 단위(「월 200만원」). 만원으로 안 떨어지면 원 단위 */
const formatKrwMonthly = (won: number) =>
  won % 10_000 === 0 ? `월 ${(won / 10_000).toLocaleString()}만원` : `월 ${won.toLocaleString()}원`;

/** 현지 통화 금액 — 「¥777,480」 「HK$12,000」. 통화를 모르면 숫자만 */
export const formatMoney = (amount: number, currency: string | null): string => {
  if (!currency) {
    return amount.toLocaleString();
  }
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
};

const formatMonthly = (amount: number, currency: string | null) =>
  currency === "KRW" || currency === null ? formatKrwMonthly(amount) : `월 ${formatMoney(amount, currency)}`;

/** 「월 200만원 ~ 월 400만원」 · 한쪽만 있으면 이상/이하 */
export const formatRentRange = (min: number | null, max: number | null, currency: string | null): string => {
  if (min !== null && max !== null) {
    return `${formatMonthly(min, currency)} ~ ${formatMonthly(max, currency)}`;
  }
  if (min !== null) {
    return `${formatMonthly(min, currency)} 이상`;
  }
  if (max !== null) {
    return `${formatMonthly(max, currency)} 이하`;
  }
  return EMPTY_CELL;
};

/** 현지 통화로 바꾼 예산 — 「¥237,904 ~ ¥594,760」 */
export const formatMoneyRange = (min: number | null, max: number | null, currency: string | null): string => {
  if (min !== null && max !== null) {
    return `${formatMoney(min, currency)} ~ ${formatMoney(max, currency)}`;
  }
  if (min !== null) {
    return `${formatMoney(min, currency)} 이상`;
  }
  if (max !== null) {
    return `${formatMoney(max, currency)} 이하`;
  }
  return EMPTY_CELL;
};

/**
 * 현지 통화 → 원화 어림값(「약 733만원」 「약 1억 2,300만원」).
 * 환율(exchange_rate)은 1,000원당 현지 통화라 원화 = 현지 금액 × 1,000 ÷ 환율
 */
export const formatKrwApprox = (amount: number, exchangeRate: number | null): string | null => {
  if (!exchangeRate) {
    return null;
  }
  const manwon = Math.round((amount * 1000) / exchangeRate / 10_000);
  if (manwon === 0) {
    return "약 1만원 미만";
  }
  const eok = Math.floor(manwon / 10_000);
  const rest = manwon % 10_000;
  if (eok === 0) {
    return `약 ${rest.toLocaleString()}만원`;
  }
  return rest === 0 ? `약 ${eok}억원` : `약 ${eok}억 ${rest.toLocaleString()}만원`;
};

/** 스펙 권장 형식 — 음수는 지하 */
export const formatFloor = (floor: number | null): string | null => {
  if (floor === null) {
    return null;
  }
  return floor < 0 ? `지하 ${Math.abs(floor)}층` : `${floor}층`;
};

const formatSearchedAt = (date: string | null) => (date ? dayjs(date).format("YYYY.MM.DD HH:mm") : EMPTY_CELL);

/************************************
 * 목록 행
 ************************************/

export type StoreSearchRow = {
  id: string;
  /** 「2026.03.18 10:20」 */
  searchedAt: string;
  location: string;
  area: string;
  rent: string;
  resultCount: number;
  /** 진행 중인 탐색은 리포트로 들어갈 수 없다(설계 노트 961:12487) */
  isCompleted: boolean;
};

export const toStoreSearchRow = (item: StoreSearchListItem): StoreSearchRow => ({
  id: String(item.uid),
  searchedAt: formatSearchedAt(item.created_time),
  location: item.location_title,
  area: formatAreaRange(item.area_min, item.area_max, item.area_unit),
  rent: formatRentRange(item.rent_fee_min, item.rent_fee_max, item.rent_currency),
  resultCount: item.result_count,
  isCompleted: item.status === "분석완료",
});

/************************************
 * 매물 카드·드로어
 ************************************/

export type StoreListingView = {
  id: string;
  /** 한국어 이름이 없으면(번역 누락) 원문 */
  title: string;
  images: string[];
  rent: string | null;
  rentKrw: string | null;
  deposit: string | null;
  depositKrw: string | null;
  /** 「58.85평」 */
  areaPyeong: string | null;
  /** 「194.55㎡」 */
  areaM2: string | null;
  floor: string | null;
  address: string | null;
  /** 한국어 주소와 다를 때만 — 현지에서 그대로 검색할 수 있게 원문도 보여준다 */
  originalAddress: string | null;
  tel: string | null;
  email: string | null;
  sourceUrl: string | null;
  /** 「athome.co.jp」 */
  sourceLabel: string | null;
  /** 좌표가 없어 주소로 검색한다 */
  mapUrl: string | null;
};

const toHost = (url: string | null) => {
  if (!url) {
    return null;
  }
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

export const toListingView = (listing: StoreListing, index: number, exchangeRate: number | null): StoreListingView => {
  const sourceUrl = toExternalUrl(listing.site_url);
  // 지도 검색은 원문 주소가 더 정확하다(번역 오류가 있다)
  const searchAddress = listing.address ?? listing.address_ko;

  return {
    id: String(index),
    title: listing.title_ko || listing.title || "이름 없는 매물",
    images: listing.image_list,
    rent: listing.rent_fee !== null ? formatMoney(listing.rent_fee, listing.rent_currency) : null,
    rentKrw: listing.rent_fee !== null ? formatKrwApprox(listing.rent_fee, exchangeRate) : null,
    deposit: listing.deposit !== null ? formatMoney(listing.deposit, listing.rent_currency) : null,
    depositKrw: listing.deposit !== null ? formatKrwApprox(listing.deposit, exchangeRate) : null,
    areaPyeong: listing.area_pyeong !== null ? `${listing.area_pyeong}평` : null,
    areaM2: listing.area !== null ? `${listing.area}㎡` : null,
    floor: formatFloor(listing.floor),
    address: listing.address_ko || listing.address,
    originalAddress: listing.address_ko && listing.address !== listing.address_ko ? listing.address : null,
    tel: listing.tel,
    email: listing.email,
    sourceUrl,
    sourceLabel: toHost(sourceUrl),
    mapUrl: searchAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchAddress)}`
      : null,
  };
};
