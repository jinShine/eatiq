"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@utils/shadcn";

import ProgressTableRow from "./ProgressTableRow";
import { PROGRESS_GRID_COLS, PROGRESS_MIN_WIDTH, getProgressColumns } from "./progressColumns";
import { type ProgressRow } from "./progressView";

type ProgressTableProps = {
  rows: ProgressRow[];
  /** 「바이어」 또는 「브랜드」 — 첫 열 제목 */
  partnerLabel: string;
  /** 더 불러올 항목이 남아 있는지 */
  hasMore: boolean;
  /** 다음 페이지를 받는 중 — 버튼을 잠근다(두 번 눌러 같은 페이지를 두 번 받지 않게) */
  isLoadingMore: boolean;
  /** 필터를 바꿔 새 결과를 받는 중 — 이전 결과를 흐리게 둔다 */
  isRefetching: boolean;
  onLoadMore: () => void;
  onDelete: (row: ProgressRow) => void;
};

export default function ProgressTable({
  rows,
  partnerLabel,
  hasMore,
  isLoadingMore,
  isRefetching,
  onLoadMore,
  onDelete,
}: ProgressTableProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-busy={isRefetching}
      className={cn(
        "border-border overflow-hidden rounded-2xl border bg-white transition-opacity",
        isRefetching && "opacity-60",
      )}
    >
      {/* 카드가 좁아져도 컬럼이 뭉개지지 않도록 가로 스크롤로 넘긴다 */}
      <div className="overflow-x-auto">
        <div className={PROGRESS_MIN_WIDTH}>
          <div role="table" aria-label="진행 관리 목록">
            <div role="row" className={cn("grid h-10 items-center pr-5 pl-6", PROGRESS_GRID_COLS)}>
              {getProgressColumns(partnerLabel).map(column => (
                <div
                  key={column.key}
                  role="columnheader"
                  className="text-text-tertiary pr-3 text-sm font-medium tracking-[-0.7px] whitespace-nowrap"
                >
                  {column.label}
                </div>
              ))}
              <span className="sr-only" role="columnheader">
                더보기
              </span>
            </div>

            <div className="h-px bg-[#f0f0f2]" />

            {/* 행 사이 구분선 — 마지막 행 아래에는 생기지 않도록 divide-y를 쓴다 */}
            <div className="divide-y divide-[#f0f0f2]">
              {rows.map((row, index) => (
                <motion.div
                  key={row.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: shouldReduceMotion ? 0 : index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProgressTableRow row={row} onDelete={onDelete} />
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
