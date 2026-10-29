"use client";

import { Plus } from "lucide-react";

import FilterChip, { ALL_FILTER_VALUE, FilterResetButton } from "@components/custom/FilterChip";
import { Button } from "@components/ui";

import {
  ALL_CITY_OPTIONS,
  PERIOD_OPTIONS,
  STORE_SEARCH_CITY_OPTIONS,
  STORE_SEARCH_COUNTRY_OPTIONS,
} from "./storeSearchView";

/** 필터 칩 값 — ""(ALL_FILTER_VALUE)면 필터 없음 */
export type StoreSearchFilters = {
  country: string;
  city: string;
  period: string;
};

export const EMPTY_FILTERS: StoreSearchFilters = {
  country: ALL_FILTER_VALUE,
  city: ALL_FILTER_VALUE,
  period: ALL_FILTER_VALUE,
};

type StoreSearchFilterBarProps = {
  filters: StoreSearchFilters;
  onChange: (filters: StoreSearchFilters) => void;
  onReset: () => void;
  onStart: () => void;
};

/**
 * 시안(961:12290): 칩 3개 · 초기화가 왼쪽에 붙고, 실행 버튼만 오른쪽 끝에 있다.
 * 시안의 검색칸은 API가 키워드 검색을 지원하지 않아(스펙 명시) 두지 않는다.
 */
export default function StoreSearchFilterBar({ filters, onChange, onReset, onStart }: StoreSearchFilterBarProps) {
  const hasActiveFilter = Object.values(filters).some(value => value !== ALL_FILTER_VALUE);

  // 국가를 고르면 그 나라 도시만 — 다른 나라 도시가 골라져 있었다면 비운다
  const cityOptions = filters.country ? (STORE_SEARCH_CITY_OPTIONS[filters.country] ?? []) : ALL_CITY_OPTIONS;
  const changeCountry = (country: string) => {
    const keepsCity = !country || STORE_SEARCH_CITY_OPTIONS[country]?.some(option => option.value === filters.city);
    onChange({ ...filters, country, city: keepsCity ? filters.city : ALL_FILTER_VALUE });
  };

  return (
    <div className="border-border border-b">
      <div className="flex flex-wrap items-center gap-2 px-6 py-3 sm:h-16 sm:flex-nowrap sm:py-0">
        {/* 좁은 화면에서는 칩이 넘쳐 이 줄만 가로로 스크롤한다 */}
        <div className="order-last flex w-full min-w-0 items-center gap-2 overflow-x-auto sm:order-none sm:w-auto [&>*]:shrink-0">
          <FilterChip
            label="국가"
            value={filters.country}
            options={STORE_SEARCH_COUNTRY_OPTIONS}
            onChange={changeCountry}
          />
          <FilterChip
            label="도시"
            value={filters.city}
            options={cityOptions}
            onChange={city => onChange({ ...filters, city })}
          />
          <FilterChip
            label="탐색 기간"
            value={filters.period}
            options={PERIOD_OPTIONS}
            onChange={period => onChange({ ...filters, period })}
          />
          <FilterResetButton disabled={!hasActiveFilter} onClick={onReset} />
        </div>

        <Button size="sm" className="ml-auto shrink-0" onClick={onStart}>
          <Plus className="size-4" />
          상권 분석 실행
        </Button>
      </div>
    </div>
  );
}
