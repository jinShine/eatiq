"use client";

import { Plus, Search } from "lucide-react";

import FilterChip, { ALL_FILTER_VALUE, FilterResetButton } from "@components/custom/FilterChip";
import { Button, Input } from "@components/ui";

import { type ProgressFilterOptions } from "./progressView";

/** 필터 칩 값 — ""(ALL_FILTER_VALUE)면 필터 없음 */
export type ProgressFilters = {
  keyword: string;
  country: string;
  category: string;
  contractType: string;
};

export const EMPTY_FILTERS: ProgressFilters = {
  keyword: "",
  country: ALL_FILTER_VALUE,
  category: ALL_FILTER_VALUE,
  contractType: ALL_FILTER_VALUE,
};

type ProgressFilterBarProps = {
  filters: ProgressFilters;
  options: ProgressFilterOptions;
  /** 「바이어」 또는 「브랜드」 — 검색창 이름에 쓴다 */
  partnerLabel: string;
  onChange: (filters: ProgressFilters) => void;
  onReset: () => void;
  onAdd: () => void;
};

/**
 * 시안(693:2080): 검색 · 칩 3개 · 초기화가 왼쪽에 붙고, 추가 버튼만 오른쪽 끝에 있다.
 * 칩 이름은 시안의 「계약 조건」 대신 표·모달과 같은 「계약 방식」으로 맞춘다(같은 값)
 */
export default function ProgressFilterBar({
  filters,
  options,
  partnerLabel,
  onChange,
  onReset,
  onAdd,
}: ProgressFilterBarProps) {
  const hasActiveFilter =
    filters.keyword !== "" ||
    filters.country !== ALL_FILTER_VALUE ||
    filters.category !== ALL_FILTER_VALUE ||
    filters.contractType !== ALL_FILTER_VALUE;

  const patch = (key: keyof ProgressFilters) => (value: string) => onChange({ ...filters, [key]: value });

  return (
    // 모바일: 「검색 + 추가 버튼」 한 줄, 칩은 아랫줄에서 가로 스크롤 — 한 줄에 다 넣으면 칩이 화면 밖으로 사라진다
    // 데스크톱(md~): 시안대로 한 줄. 추가 버튼만 오른쪽 끝
    <div className="border-border grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b px-6 py-3 md:flex md:h-16 md:gap-4 md:py-0">
      <Input
        size="sm"
        placeholder="검색"
        aria-label={`${partnerLabel} 이름·담당자 검색`}
        className="w-full md:w-60 md:shrink-0"
        startAdornment={<Search className="text-text-disabled size-4" />}
        value={filters.keyword}
        onChange={event => patch("keyword")(event.target.value)}
      />

      <Button size="sm" className="shrink-0 md:order-last md:ml-auto" onClick={onAdd}>
        <Plus className="size-4" />
        관리 기록 추가
      </Button>

      <div className="col-span-2 flex min-w-0 items-center gap-2 overflow-x-auto [&>*]:shrink-0">
        <FilterChip label="국가" value={filters.country} options={options.countries} onChange={patch("country")} />
        <FilterChip
          label="카테고리"
          value={filters.category}
          options={options.categories}
          onChange={patch("category")}
        />
        <FilterChip
          label="계약 방식"
          value={filters.contractType}
          options={options.contractTypes}
          onChange={patch("contractType")}
        />
        <FilterResetButton disabled={!hasActiveFilter} onClick={onReset} />
      </div>
    </div>
  );
}
