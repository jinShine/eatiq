import { Skeleton } from "@components/ui";

import { cn } from "@utils/shadcn";

import { PROGRESS_COLUMNS, PROGRESS_GRID_COLS, PROGRESS_MIN_WIDTH } from "./progressColumns";

/** 셀마다 폭을 달리해 실제 데이터처럼 보이게 한다 (모두 같은 길이면 로딩이 더 지루해 보인다) */
const CELL_WIDTHS = ["w-28", "w-24", "w-20", "w-14", "w-20", "w-24", "w-20"];

const SKELETON_ROWS = 6;

export default function ProgressTableSkeleton() {
  return (
    <div className="border-border overflow-hidden rounded-2xl border bg-white">
      <div className="overflow-x-auto">
        <div className={PROGRESS_MIN_WIDTH}>
          <div className={cn("grid h-10 items-center pr-5 pl-6", PROGRESS_GRID_COLS)} aria-hidden>
            {PROGRESS_COLUMNS.map(column => (
              <div
                key={column.key}
                className="text-text-tertiary pr-3 text-sm font-medium tracking-[-0.7px] whitespace-nowrap"
              >
                {column.label}
              </div>
            ))}
          </div>

          <div className="h-px bg-[#f0f0f2]" />

          <div role="status" aria-label="진행 관리 목록을 불러오는 중" className="divide-y divide-[#f0f0f2]">
            {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
              <div key={rowIndex} className={cn("grid h-[50px] items-center px-6", PROGRESS_GRID_COLS)}>
                {CELL_WIDTHS.map((width, cellIndex) => (
                  <div key={cellIndex} className="pr-3">
                    <Skeleton className={cn("h-3.5 rounded", width)} />
                  </div>
                ))}
                <div className="flex justify-end">
                  <Skeleton className="size-4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
