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
    // 줄 나눔은 화면 폭이 아니라 필터바 자체의 폭으로 정한다(컨테이너 쿼리) — 사이드바를 펼치고 접으면 본문 폭이 달라진다.
    // 한 줄(시안)에 필요한 폭: 검색 240 + 칩·초기화 395 + 추가 117 + 간격 32 + 좌우 여백 48 ≈ 832px
    // - 그보다 좁으면: 「검색 + 추가 버튼」 / 「칩 + 초기화」 두 줄 — 한 줄에 넣으면 칩·초기화가 가려진다
    // - 넓으면: 시안대로 한 줄, 추가 버튼만 오른쪽 끝
    <div className="border-border @container border-b">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-6 py-3 @[53rem]:flex @[53rem]:h-16 @[53rem]:gap-4 @[53rem]:py-0">
        {/* Input 바깥 틀이 h-full이라 그대로 두면 필터바 높이(64px)로 늘어나 입력칸이 위로 붙는다 — 한 번 감싼다 */}
        <div className="min-w-0 @[53rem]:w-60 @[53rem]:shrink-0">
          <Input
            size="sm"
            placeholder="검색"
            aria-label={`${partnerLabel} 이름·담당자 검색`}
            startAdornment={<Search className="text-text-disabled size-4" />}
            value={filters.keyword}
            onChange={event => patch("keyword")(event.target.value)}
          />
        </div>

        <Button size="sm" className="shrink-0 @[53rem]:order-last @[53rem]:ml-auto" onClick={onAdd}>
          <Plus className="size-4" />
          관리 기록 추가
        </Button>

        {/* 아주 좁은 화면(모바일)에서는 두 줄이어도 칩이 넘쳐 이 줄만 가로로 스크롤한다 */}
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
    </div>
  );
}
