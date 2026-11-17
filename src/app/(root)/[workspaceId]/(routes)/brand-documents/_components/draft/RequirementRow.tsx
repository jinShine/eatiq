import Link from "next/link";

import { cn } from "@utils/shadcn";

import { type RequirementRow as Row } from "./draftRequirements";

const BADGE_BASE = "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold";

type RequirementRowProps = {
  row: Row;
  /** 필수 행 — 미보유면 빨간 테두리·빨간 안내 */
  isRequired: boolean;
};

/**
 * 자료 한 행 (피그마 「행 상태 안내 — 개발용」 2291:1182).
 * 보유 — 파란 배지 / 미보유 — 「입력」 테두리 배지(필수는 빨강) / 문서에서 · 자동 — 회색 테두리.
 * 「입력」은 지금은 값을 채우는 화면으로 보낸다. 행 안에서 바로 입력하는 건 다음 단계
 */
export default function RequirementRow({ row, isRequired }: RequirementRowProps) {
  const isMissing = row.status === "missing";

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-baseline gap-1.5 break-keep">
          <span className="text-text-primary text-sm font-semibold">{row.label}</span>
          <span className="text-text-tertiary text-xs">{row.usedIn}</span>
        </p>

        {row.status === "have" && <span className={cn(BADGE_BASE, "bg-info text-white")}>보유</span>}
        {(row.status === "document" || row.status === "auto") && (
          <span className={cn(BADGE_BASE, "border-border text-text-secondary border")}>
            {row.status === "document" ? "문서에서" : "자동"}
          </span>
        )}
        {isMissing && row.fillHref && (
          <Link
            href={row.fillHref}
            className={cn(
              BADGE_BASE,
              "border bg-white transition-colors",
              isRequired
                ? "border-primary text-primary hover:bg-primary-background"
                : "border-border text-text-secondary hover:bg-secondary-background",
            )}
          >
            입력
          </Link>
        )}
        {/* 채울 화면이 아직 없는 자료(소개 영상의 매장·조리 사진, 진행 건에서 오는 값) — 누를 곳 없이 상태만 알린다 */}
        {isMissing && !row.fillHref && (
          <span
            className={cn(
              BADGE_BASE,
              "border bg-white",
              isRequired ? "border-primary text-primary" : "border-border text-text-secondary",
            )}
          >
            준비 중
          </span>
        )}
      </div>

      {row.message && (
        <p className={cn("text-xs break-keep", isMissing && isRequired ? "text-destructive" : "text-text-tertiary")}>
          {row.message}
        </p>
      )}
    </li>
  );
}
