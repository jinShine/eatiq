"use client";

import FilterChip, { FilterResetButton } from "@components/custom/FilterChip";

import {
  ALL_VALUE,
  CATEGORY_FILTER_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
  COUNTRY_FILTER_OPTIONS,
} from "../../progress/_components/progressOptions";

export type BuyerFilters = {
  country: string;
  category: string;
  contractType: string;
};

export const EMPTY_BUYER_FILTERS: BuyerFilters = {
  country: ALL_VALUE,
  category: ALL_VALUE,
  contractType: ALL_VALUE,
};

type BuyerFilterBarProps = {
  filters: BuyerFilters;
  onChange: (filters: BuyerFilters) => void;
  onReset: () => void;
};

/** 시안에는 검색창이 없고 필터 칩 3개 + 초기화만 있다 (진행 관리와 다른 점) */
export default function BuyerFilterBar({ filters, onChange, onReset }: BuyerFilterBarProps) {
  const hasActiveFilter =
    filters.country !== ALL_VALUE || filters.category !== ALL_VALUE || filters.contractType !== ALL_VALUE;

  const patch = (key: keyof BuyerFilters) => (value: string) => onChange({ ...filters, [key]: value });

  return (
    <div className="border-border flex h-16 items-center justify-between gap-4 border-b px-6">
      <div className="flex items-center gap-2">
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
          options={CONTRACT_TYPE_OPTIONS}
          onChange={patch("contractType")}
        />
      </div>

      <FilterResetButton disabled={!hasActiveFilter} onClick={onReset} />
    </div>
  );
}
