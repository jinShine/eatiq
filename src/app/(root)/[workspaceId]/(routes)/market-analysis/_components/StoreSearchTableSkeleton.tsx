import { Skeleton } from "@components/ui";

import { cn } from "@utils/shadcn";

import { STORE_SEARCH_COLUMNS, STORE_SEARCH_GRID_COLS, STORE_SEARCH_MIN_WIDTH } from "./storeSearchColumns";

/** 셀마다 폭을 달리해 실제 데이터처럼 보이게 한다 */
const CELL_WIDTHS = ["w-28", "w-20", "w-16", "w-36"];

const SKELETON_ROWS = 6;

export default function StoreSearchTableSkeleton() {
  return (
    <div className="border-border overflow-hidden rounded-2xl border bg-white">
      <div className="overflow-x-auto">
        <div className={STORE_SEARCH_MIN_WIDTH}>
          <div className={cn("grid h-10 items-center gap-5 px-6", STORE_SEARCH_GRID_COLS)} aria-hidden>
            {STORE_SEARCH_COLUMNS.map(column => (
              <div
                key={column.key}
                className="text-text-tertiary text-sm font-bold tracking-[-0.7px] whitespace-nowrap"
              >
                {column.label}
              </div>
            ))}
          </div>

          <div className="h-px bg-[#f0f0f2]" />

          <div role="status" aria-label="상가 매물 탐색 기록을 불러오는 중">
            {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
              <div key={rowIndex} className={cn("grid h-[50px] items-center gap-5 px-6", STORE_SEARCH_GRID_COLS)}>
                {CELL_WIDTHS.map((width, cellIndex) => (
                  <Skeleton key={cellIndex} className={cn("h-3.5 rounded", width)} />
                ))}
                <Skeleton className="h-3.5 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
