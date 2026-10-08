"use client";

import FilterChip, { ALL_FILTER_VALUE, FilterResetButton } from "@components/custom/FilterChip";

import { CATEGORY_FILTER_OPTIONS, CONTRACT_TYPE_FILTER_OPTIONS, COUNTRY_FILTER_OPTIONS } from "./buyerView";

/** 필터 칩 값 — ""(ALL_FILTER_VALUE)면 필터 없음 */
export type BuyerFilters = {
  country: string;
  category: string;
  contractType: string;
};

export const EMPTY_BUYER_FILTERS: BuyerFilters = {
  country: ALL_FILTER_VALUE,
  category: ALL_FILTER_VALUE,
  contractType: ALL_FILTER_VALUE,
};

type BuyerFilterBarProps = {
  filters: BuyerFilters;
  onChange: (filters: BuyerFilters) => void;
  onReset: () => void;
};

/** 시안에는 검색창이 없고 필터 칩 3개 + 초기화만 있다 (진행 관리와 다른 점) */
export default function BuyerFilterBar({ filters, onChange, onReset }: BuyerFilterBarProps) {
  const hasActiveFilter =
    filters.country !== ALL_FILTER_VALUE ||
    filters.category !== ALL_FILTER_VALUE ||
    filters.contractType !== ALL_FILTER_VALUE;

  const patch = (key: keyof BuyerFilters) => (value: string) => onChange({ ...filters, [key]: value });

  return (
    <div className="border-border flex h-16 items-center justify-between gap-4 border-b px-6">
      {/* 좁은 화면에서는 칩 줄만 가로로 스크롤한다 — 초기화 버튼이 화면 밖으로 밀리지 않게 */}
      <div className="flex min-w-0 items-center gap-2 overflow-x-auto [&>*]:shrink-0">
        <FilterChip label="국가" value={filters.country} options={COUNTRY_FILTER_OPTIONS} onChange={patch("country")} />
        <FilterChip
          label="카테고리"
          value={filters.category}
          options={CATEGORY_FILTER_OPTIONS}
          onChange={patch("category")}
        />
        <FilterChip
          label="계약 조건"
          value={filters.contractType}
          options={CONTRACT_TYPE_FILTER_OPTIONS}
          onChange={patch("contractType")}
        />
      </div>

      <FilterResetButton disabled={!hasActiveFilter} onClick={onReset} />
    </div>
  );
}
