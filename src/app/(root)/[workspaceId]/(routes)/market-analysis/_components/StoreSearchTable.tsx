"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@utils/shadcn";

import { STORE_SEARCH_COLUMNS, STORE_SEARCH_GRID_COLS, STORE_SEARCH_MIN_WIDTH } from "./storeSearchColumns";
import { type StoreSearchRow } from "./storeSearchView";

function StoreSearchTableRow({ row }: { row: StoreSearchRow }) {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  return (
    <div
      role="row"
      className={cn(
        "relative grid h-[50px] items-center gap-5 px-6 text-[13px] transition-colors",
        row.isCompleted && "hover:bg-[#fafafb]",
        STORE_SEARCH_GRID_COLS,
      )}
    >
      <div role="cell" className="text-text-primary font-semibold tabular-nums">
        {row.searchedAt}
      </div>
      <div role="cell" className="truncate text-[#6b7280]">
        {row.location}
      </div>
      <div role="cell" className="truncate text-[#6b7280]">
        {row.area}
      </div>
      <div role="cell" className="truncate text-[#6b7280]">
        {row.rent}
      </div>

      {/* 시안의 행 메뉴(⋮)는 삭제 API가 없어 두지 않는다 */}
      <div role="cell" className="flex justify-end">
        {row.isCompleted ? (
          // 링크 영역을 행 전체로 넓힌다(after:inset-0) — 스펙 「행 또는 버튼을 누르면 상세로」
          <Link
            href={`/${workspaceId}/market-analysis/${row.id}`}
            aria-label={`${row.searchedAt} ${row.location} 상세 분석 보기`}
            className="text-text-primary focus-visible:ring-ring rounded font-bold whitespace-nowrap after:absolute after:inset-0 hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            상세 분석 보기
          </Link>
        ) : (
          <span className="text-text-disabled font-bold whitespace-nowrap">분석 진행 중</span>
        )}
      </div>
    </div>
  );
}

type StoreSearchTableProps = {
  rows: StoreSearchRow[];
  /** 더 불러올 항목이 남아 있는지 */
  hasMore: boolean;
  /** 다음 페이지를 받는 중 — 버튼을 잠근다(두 번 눌러 같은 페이지를 두 번 받지 않게) */
  isLoadingMore: boolean;
  /** 필터를 바꿔 새 결과를 받는 중 — 이전 결과를 흐리게 둔다 */
  isRefetching: boolean;
  onLoadMore: () => void;
};

export default function StoreSearchTable({
  rows,
  hasMore,
  isLoadingMore,
  isRefetching,
  onLoadMore,
}: StoreSearchTableProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-busy={isRefetching}
      className={cn(
        "border-border overflow-hidden rounded-2xl border bg-white transition-opacity",
        isRefetching && "opacity-60",
      )}
    >
      <div className="overflow-x-auto">
        <div className={STORE_SEARCH_MIN_WIDTH}>
          <div role="table" aria-label="상가 매물 탐색 기록">
            <div role="row" className={cn("grid h-10 items-center gap-5 px-6", STORE_SEARCH_GRID_COLS)}>
              {STORE_SEARCH_COLUMNS.map(column => (
                <div
                  key={column.key}
                  role="columnheader"
                  className="text-text-tertiary text-sm font-bold tracking-[-0.7px] whitespace-nowrap"
                >
                  {column.label}
                </div>
              ))}
              <span className="sr-only" role="columnheader">
                상세
              </span>
            </div>

            <div className="h-px bg-[#f0f0f2]" />

            {/* 행 사이 구분선 없음(시안) */}
            <div>
              {rows.map((row, index) => (
                <motion.div
                  key={row.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: shouldReduceMotion ? 0 : index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StoreSearchTableRow row={row} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="text-text-tertiary hover:text-text-primary focus-visible:ring-ring w-full border-t border-[#f0f0f2] py-[14px] text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset disabled:cursor-wait"
        >
          {isLoadingMore ? "불러오는 중…" : "더 보기"}
        </button>
      )}
    </div>
  );
}
