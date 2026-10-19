"use client";

import Link from "next/link";

import { cn } from "@utils/shadcn";

import SectionHeader from "./SectionHeader";
import { type ActivityView } from "./dashboardView";

/** 활동 종류별 점 색 — 서버가 주는 제목으로 가른다. 모르는 종류는 회색 */
const DOT_CLASS: Record<string, string> = {
  "CRM 기록 추가": "bg-[#0066cc]",
  "다음 액션 완료": "bg-[#059669]",
  "메일 발송": "bg-[#d97700]",
};

function ActivityContent({ activity }: { activity: ActivityView }) {
  return (
    <>
      <span
        aria-hidden
        className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT_CLASS[activity.title] ?? "bg-[#9ca3aa]")}
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-sm font-bold tracking-[-0.7px]">
          <span className="text-text-primary">{activity.title}</span>
          <span className="font-medium text-[#6b7280]"> · {activity.time}</span>
        </span>
        <span className="text-xs font-medium tracking-[-0.55px] text-[#6b7280]">{activity.message}</span>
      </span>
    </>
  );
}

type ActivitySectionProps = {
  workspaceId: string;
  activities: ActivityView[];
};

/**
 * 최근 활동 (피그마 59:6714) — 최신순 최대 10개. 진행 관리 건이면 누르면 그 상세로 간다.
 * 이미 지운 건이면 상세가 404 → 토스트 후 목록으로 돌아온다(진행 관리 상세의 처리).
 */
export default function ActivitySection({ workspaceId, activities }: ActivitySectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title="최근 활동" />

      {activities.length === 0 ? (
        <p className="border-border text-text-tertiary rounded-xl border border-dashed px-5 py-8 text-center text-sm">
          아직 활동이 없어요.
        </p>
      ) : (
        <ul className="divide-y divide-[rgba(224,226,229,0.8)]">
          {activities.map(activity => (
            <li key={activity.id}>
              {activity.crmId ? (
                <Link
                  href={`/${workspaceId}/progress/${activity.crmId}`}
                  className="hover:bg-secondary-background/60 focus-visible:ring-primary -mx-2 flex gap-3.5 rounded-lg px-2 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <ActivityContent activity={activity} />
                </Link>
              ) : (
                <div className="flex gap-3.5 py-3">
                  <ActivityContent activity={activity} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
