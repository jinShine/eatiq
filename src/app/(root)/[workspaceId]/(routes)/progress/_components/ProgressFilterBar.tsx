"use client";

import { Search } from "lucide-react";

import FilterChip, { FilterResetButton } from "@components/custom/FilterChip";
import { Input } from "@components/ui";

import { ALL_VALUE, CATEGORY_FILTER_OPTIONS, CONTRACT_TYPE_OPTIONS, COUNTRY_FILTER_OPTIONS } from "./progressOptions";

export type ProgressFilters = {
  keyword: string;
  country: string;
  category: string;
  contractType: string;
};

export const EMPTY_FILTERS: ProgressFilters = {
  keyword: "",
  country: ALL_VALUE,
  category: ALL_VALUE,
  contractType: ALL_VALUE,
};

type ProgressFilterBarProps = {
  filters: ProgressFilters;
  onChange: (filters: ProgressFilters) => void;
  onReset: () => void;
};

export default function ProgressFilterBar({ filters, onChange, onReset }: ProgressFilterBarProps) {
  const hasActiveFilter =
    filters.keyword !== "" ||
    filters.country !== ALL_VALUE ||
    filters.category !== ALL_VALUE ||
    filters.contractType !== ALL_VALUE;

  const patch = (key: keyof ProgressFilters) => (value: string) => onChange({ ...filters, [key]: value });

  return (
    <div className="border-border flex h-16 items-center justify-between gap-4 border-b px-6">
      <div className="flex items-center gap-2">
        <Input
          size="sm"
          placeholder="검색"
          aria-label="바이어 검색"
          className="w-60"
          startAdornment={<Search className="text-text-disabled size-4" />}
          value={filters.keyword}
          onChange={event => patch("keyword")(event.target.value)}
        />

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
