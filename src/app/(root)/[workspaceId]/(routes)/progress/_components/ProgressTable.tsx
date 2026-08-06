"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@utils/shadcn";

import ProgressTableRow from "./ProgressTableRow";
import { PROGRESS_COLUMNS, PROGRESS_GRID_COLS, PROGRESS_MIN_WIDTH, type ProgressRow } from "./progressColumns";

type ProgressTableProps = {
  rows: ProgressRow[];
};

export default function ProgressTable({ rows }: ProgressTableProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="border-border overflow-hidden rounded-2xl border bg-white">
      {/* 카드가 좁아져도 컬럼이 뭉개지지 않도록 가로 스크롤로 넘긴다 */}
      <div className="overflow-x-auto">
        <div className={PROGRESS_MIN_WIDTH}>
          <div role="table" aria-label="진행 관리 목록">
            <div role="row" className={cn("grid h-10 items-center pr-5 pl-6", PROGRESS_GRID_COLS)}>
              {PROGRESS_COLUMNS.map(column => (
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
                  <ProgressTableRow row={row} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
