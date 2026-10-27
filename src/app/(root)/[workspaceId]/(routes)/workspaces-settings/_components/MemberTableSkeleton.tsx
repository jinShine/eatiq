import { Skeleton } from "@components/ui";

import { cn } from "@utils/shadcn";

// MemberTable과 같은 그리드·행 높이를 써야 데이터가 도착할 때 콘텐츠가 튀지 않는다
import { MEMBER_GRID_COLS, MEMBER_TABLE_MIN_WIDTH } from "./MemberTable";

const COLUMNS = ["이름", "이메일", "권한", "상태", "최근 접속일"] as const;

/** 셀마다 폭을 달리해 실제 데이터처럼 보이게 한다 */
const ROW_WIDTHS = [
  ["w-14", "w-40", "w-10", "w-8", "w-20"],
  ["w-16", "w-44", "w-10", "w-8", "w-20"],
  ["w-12", "w-36", "w-10", "w-14", "w-6"],
  ["w-16", "w-48", "w-10", "w-16", "w-6"],
];

export default function MemberTableSkeleton() {
  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <div className={MEMBER_TABLE_MIN_WIDTH}>
          <div className={cn(MEMBER_GRID_COLS, "bg-secondary-background h-11 border-b")} aria-hidden>
            {COLUMNS.map(column => (
              <span key={column} className="text-text-tertiary text-xs font-medium whitespace-nowrap">
                {column}
              </span>
            ))}
            <span />
          </div>

          <ul role="status" aria-label="사용자 목록을 불러오는 중" className="divide-border divide-y">
            {ROW_WIDTHS.map((widths, rowIndex) => (
              <li key={rowIndex} className={cn(MEMBER_GRID_COLS, "h-14")}>
                {widths.map((width, cellIndex) => (
                  <Skeleton key={cellIndex} className={cn("h-3.5", width)} />
                ))}
                <span />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
