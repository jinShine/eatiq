"use client";

import { Check, ChevronDown, Search } from "lucide-react";

import { DropdownMenu, DropdownMenuItem, Input } from "@components/ui";

import { cn } from "@utils/shadcn";

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

type FilterOption = { value: string; label: string };

type FilterChipProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

const ALL_OPTION: FilterOption = { value: ALL_VALUE, label: "전체" };

function FilterChip({ label, value, options, onChange }: FilterChipProps) {
  const withAll = options[0]?.value === ALL_VALUE ? options : [ALL_OPTION, ...options];
  const selected = withAll.find(option => option.value === value) ?? ALL_OPTION;
  const isActive = value !== ALL_VALUE;

  return (
    <DropdownMenu
      align="start"
      className="min-w-[10rem]"
      trigger={
        <button
          type="button"
          className={cn(
            "flex h-9 items-center gap-1 rounded-lg border px-2.5 transition-colors",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            isActive ? "border-primary/40 bg-primary-background" : "border-border bg-white hover:border-text-disabled",
          )}
        >
          <span className="text-text-disabled text-sm tracking-[-0.7px] whitespace-nowrap">{label}:</span>
          <span
            className={cn(
              "text-sm font-medium tracking-[-0.7px] whitespace-nowrap",
              isActive ? "text-primary" : "text-text-primary",
            )}
          >
            {selected.label}
          </span>
          <ChevronDown className="text-text-disabled size-4" />
        </button>
      }
    >
      {withAll.map(option => (
        <DropdownMenuItem key={option.value || "all"} onSelect={() => onChange(option.value)}>
          <span className="flex-1">{option.label}</span>
          {option.value === value && <Check className="text-primary size-3.5" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}

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

      <button
        type="button"
        onClick={onReset}
        disabled={!hasActiveFilter}
        className={cn(
          "shrink-0 rounded text-xs transition-colors",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
          hasActiveFilter ? "text-text-secondary hover:text-text-primary" : "text-text-disabled cursor-default",
        )}
      >
        초기화
      </button>
    </div>
  );
}
