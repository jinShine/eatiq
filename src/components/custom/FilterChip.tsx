"use client";

import { Check, ChevronDown } from "lucide-react";

import { DropdownMenu, DropdownMenuItem } from "@components/ui";

import { cn } from "@utils/shadcn";

export type FilterOption = { value: string; label: string };

/** 필터 기본값 — "전체"는 빈 문자열로 두고 쿼리에서 생략한다 */
export const ALL_FILTER_VALUE = "";

const ALL_OPTION: FilterOption = { value: ALL_FILTER_VALUE, label: "전체" };

type FilterChipProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

/**
 * 목록 화면 상단의 드롭다운 필터 칩.
 * 진행 관리·바이어 탐색이 동일한 필터(국가·카테고리·계약 조건)를 쓰므로 공용으로 둔다.
 */
export default function FilterChip({ label, value, options, onChange }: FilterChipProps) {
  const withAll = options[0]?.value === ALL_FILTER_VALUE ? options : [ALL_OPTION, ...options];
  const selected = withAll.find(option => option.value === value) ?? ALL_OPTION;
  const isActive = value !== ALL_FILTER_VALUE;

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

type FilterResetButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

/** 필터바 우측 "초기화" — 활성 필터가 없으면 비활성 */
export function FilterResetButton({ disabled, onClick }: FilterResetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "shrink-0 rounded text-xs transition-colors",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        disabled ? "text-text-disabled cursor-default" : "text-text-secondary hover:text-text-primary",
      )}
    >
      초기화
    </button>
  );
}
