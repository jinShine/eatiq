"use client";

import Link from "next/link";

import { cn } from "@utils/shadcn";

import SectionHeader from "./SectionHeader";
import { type DashboardNextActionView } from "./dashboardView";

/** 마감이 이만큼 남았거나 지났으면 빨강, 그보다 여유 있으면 주황 (시안: D-2·오늘 빨강, D-5 주황) */
const URGENT_DAYS = 3;

const toBadgeClass = (dDayCount: number | null) => {
  if (dDayCount === null) {
    return "bg-[#f3f4f6] text-[#6b7280]";
  }
  return dDayCount <= URGENT_DAYS ? "bg-[#dc3232] text-white" : "bg-[#d97700] text-white";
};

type NextActionSectionProps = {
  workspaceId: string;
  actions: DashboardNextActionView[];
};

/**
 * 이번 주 Next Action (피그마 59:6627) — 마감이 가까운 미완료 다음 액션 최대 3개.
 * 시안 카드의 「계약 검토 · 메일 보내기」 버튼은 동작 API가 없어 두지 않고, 카드를 누르면 진행 관리 상세로 간다.
 */
export default function NextActionSection({ workspaceId, actions }: NextActionSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title="이번 주 Next Action" moreHref={`/${workspaceId}/progress`} moreLabel="전체 보기" />

      {actions.length === 0 ? (
        <p className="border-border text-text-tertiary rounded-xl border border-dashed px-5 py-8 text-center text-sm">
          남은 다음 액션이 없어요. 진행 기록을 남기면 여기에 할 일이 모여요.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {actions.map(action => (
            <li key={action.id}>
              <Link
                href={`/${workspaceId}/progress/${action.crmId}`}
                className="focus-visible:ring-primary flex h-full flex-col gap-3 rounded-xl bg-white p-5 shadow-[0px_2px_8px_0px_rgba(17,24,39,0.07)] transition-shadow hover:shadow-[0px_4px_16px_0px_rgba(17,24,39,0.12)] focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-primary truncate text-sm font-bold tracking-[-0.7px]">
                    {action.companyName}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded px-[7px] py-[3px] text-[11px] font-semibold",
                      toBadgeClass(action.dDayCount),
                    )}
                  >
                    {action.dDayLabel ?? "기한 없음"}
                  </span>
                </div>
                <p className="text-text-primary text-sm font-medium tracking-[-0.7px]">{action.title}</p>
                {/* 서버는 내용이 없으면 제목을 그대로 넣어 준다 — 같으면 한 번만 보여준다 */}
                {action.description && action.description !== action.title && (
                  <p className="line-clamp-2 text-sm font-medium tracking-[-0.7px] text-[#6b7280]">
                    {action.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
