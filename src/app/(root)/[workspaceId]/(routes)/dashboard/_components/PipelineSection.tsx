"use client";

import Link from "next/link";

import { cn } from "@utils/shadcn";

import { getActionTypeMeta } from "../../progress/[progressId]/_components/recordOptions";
import { STAGE_META } from "../../progress/_components/progressOptions";
import SectionHeader from "./SectionHeader";
import { type StageCountView } from "./dashboardView";

type PipelineSectionProps = {
  workspaceId: string;
  stageCounts: StageCountView[];
};

/**
 * 업무 진행 현황 (피그마 59:6663) — 진행 단계별 건수.
 * 시안은 영문 6단계지만 API·진행 관리 화면과 같은 한국어 8단계로 보여준다.
 * 진행 관리 목록에 단계 필터가 없어 누르면 목록으로만 간다.
 */
export default function PipelineSection({ workspaceId, stageCounts }: PipelineSectionProps) {
  const progressHref = `/${workspaceId}/progress`;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title="업무 진행 현황" moreHref={progressHref} moreLabel="진행 관리 보기" />

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
        {stageCounts.map(({ stage, count }) => (
          <li key={stage}>
            <Link
              href={progressHref}
              aria-label={`${STAGE_META[stage].label} ${count}건 — 진행 관리 보기`}
              className="border-border hover:border-text-disabled focus-visible:ring-primary flex flex-col gap-2 rounded-xl border bg-white p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {/* 막대 색은 진행 기록 카드의 유형 점과 같은 계열 */}
              <span aria-hidden className={cn("h-1 w-full rounded-sm", getActionTypeMeta(stage).dotClassName)} />
              <span className="text-[11px] font-medium tracking-[-0.55px] text-[#9ca3aa]">
                {STAGE_META[stage].label}
              </span>
              <span className="flex items-baseline gap-1">
                <span className="text-text-primary text-[22px] font-bold tracking-[-1.1px] tabular-nums">{count}</span>
                <span className="text-[11px] font-medium tracking-[-0.55px] text-[#6b7280]">건</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
