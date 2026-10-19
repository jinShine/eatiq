"use client";

import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import CircularProgress from "../../company-settings/_components/completion/CircularProgress";
import JourneyStepper from "../../company-settings/_components/completion/JourneyStepper";
import {
  BRAND_JOURNEY_STAGES,
  BUYER_JOURNEY_STAGES,
  toStageIndex,
} from "../../company-settings/_components/completion/journeyStages";
import { type DashboardView } from "./dashboardView";

const focusRing =
  "focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

type JourneySectionProps = {
  workspaceId: string;
  isBuyer: boolean;
  dashboard: DashboardView;
};

/**
 * 저니 패널 (피그마 60:7594) — 단계 · 완성도 · 먼저 채우면 좋은 항목.
 * 단계 바와 원형 진행률은 회사 정보 설정의 저니 패널과 같은 컴포넌트를 쓴다.
 *
 * 채울 항목이 없으면(완성) 시안의 축소형으로 보여준다.
 * 완성 단계의 「지금 챙기면 좋은 것」(오래된 정보·안 써본 기능)은 API가 없어 그리지 않는다.
 */
export default function JourneySection({ workspaceId, isBuyer, dashboard }: JourneySectionProps) {
  const stages = isBuyer ? BUYER_JOURNEY_STAGES : BRAND_JOURNEY_STAGES;
  const stageIndex = toStageIndex(stages, dashboard.step);
  const partnerLabel = isBuyer ? "브랜드" : "바이어";
  const isDone = dashboard.recommendedTasks.length === 0;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-text-primary text-lg font-bold tracking-[-0.9px]">
        {isBuyer ? "정보를 입력하고 딱 맞는 브랜드를 만나보세요" : "브랜드 정보를 입력하고 바이어를 만나보세요"}
      </h2>

      <JourneyStepper stages={stages} currentIndex={stageIndex} />

      <div className="bg-border h-px w-full" />

      {isDone ? (
        <div className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-primary text-sm font-medium tracking-[-0.7px] whitespace-pre-line">
            {dashboard.stepMessage}
          </p>
          <Link
            href={`/${workspaceId}/${isBuyer ? "brand" : "buyer"}`}
            className={`text-primary group inline-flex shrink-0 items-center gap-1 rounded text-sm font-semibold ${focusRing}`}
          >
            {partnerLabel} 탐색하기
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : (
        <div className="divide-border grid grid-cols-1 gap-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-0 lg:divide-x">
          {/* 진행률 */}
          <div className="flex items-center gap-4 lg:pr-6">
            <CircularProgress rate={dashboard.rate} label="정보 완성률" />
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-bold tracking-[-0.7px]">
                <span className="text-primary">{dashboard.step}</span>
                <span className="text-text-primary"> 단계</span>
              </p>
              <p className="text-text-primary text-sm font-medium tracking-[-0.7px] whitespace-pre-line">
                {dashboard.stepMessage}
              </p>
            </div>
          </div>

          {/* 먼저 채우면 좋은 항목 — 서버가 우선순위대로 최대 3개 */}
          <div className="flex min-w-0 flex-col gap-3 lg:pl-6">
            <p className="text-text-primary text-sm font-medium tracking-[-0.7px]">먼저 채우면 좋은 항목</p>
            <ul className="flex flex-col gap-3">
              {dashboard.recommendedTasks.map(task => (
                <li key={task.key} className="border-border flex items-center justify-between gap-3 rounded border p-3">
                  <div className="min-w-0">
                    <p className="text-text-primary text-[11px] font-medium tracking-[-0.55px]">{task.groupLabel}</p>
                    <p className="text-text-primary truncate text-sm font-bold tracking-[-0.7px]" title={task.title}>
                      {task.title}
                    </p>
                  </div>
                  <Link
                    href={task.href}
                    aria-label={`${task.title} 입력하기`}
                    className={`border-primary text-primary hover:bg-primary-background group inline-flex shrink-0 items-center gap-1 rounded-lg border bg-white px-3 py-2 text-[13px] font-medium transition-colors ${focusRing}`}
                  >
                    입력
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
