"use client";

import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Skeleton } from "@components/ui";

import { type BrandSettingsTab, useBrandJourney } from "@services/api/brand/brand.query";

import CircularProgress from "./CircularProgress";
import JourneyStepper from "./JourneyStepper";
import { JOURNEY_STAGES, resolveStageIndex } from "./journeyStages";

const MISSING_ITEMS_LIMIT = 3;

type CompletionStatusCardProps = {
  workspaceId: string;
  tab: BrandSettingsTab;
  tabLabel: string; // 제목에 붙는 탭 이름 — "정보 완성 현황 - 기본 정보"
};

export default function CompletionStatusCard({ workspaceId, tab, tabLabel }: CompletionStatusCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const { data: journey, isLoading } = useBrandJourney(workspaceId, tab);

  if (isLoading) {
    return <Skeleton className="h-[282px] w-full rounded-2xl" />;
  }
  if (!journey) {
    return null;
  }

  const rate = journey.completionRate ?? 0;
  const stageIndex = resolveStageIndex(journey.journeyStage, rate);
  const { nextAction } = journey;

  // 다음 액션에 해당하는 혜택 문구 (targetAnchor ↔ itemKey 매칭)
  const nextBenefit = journey.benefits?.find(b => b.itemKey === nextAction?.targetAnchor)?.benefitText;

  // 필수 먼저 + sortOrder 순으로 정렬해 상위 N개만
  const missingItems = [...(journey.missingItems ?? [])]
    .sort((a, b) => Number(b.isRequired) - Number(a.isRequired) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .slice(0, MISSING_ITEMS_LIMIT);

  const buildHref = (targetTab?: string, targetAnchor?: string) =>
    `/${workspaceId}/brand-settings?tab=${targetTab ?? tab}${targetAnchor ? `#${targetAnchor}` : ""}`;

  return (
    <section className="border-border rounded-2xl border p-6">
      <h2 className="text-text-primary text-base font-bold tracking-tight">정보 완성 현황 - {tabLabel}</h2>

      {/* 스테퍼 — 전체 폭 */}
      <div className="mt-4">
        <JourneyStepper currentIndex={stageIndex} />
      </div>

      <div className="bg-border mt-4 h-px w-full" />

      {/* 3열 본문 — 수직 구분선으로 분할 */}
      <div className="divide-border mt-4 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0 md:divide-x">
        {/* 열1 — 진행률 */}
        <div className="flex flex-col justify-between gap-4 md:pr-6">
          <div className="flex items-center gap-4">
            <CircularProgress rate={rate} />
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-bold">
                <span className="text-primary">{JOURNEY_STAGES[stageIndex].label}</span>
                <span className="text-text-primary"> 단계</span>
              </p>
              {nextBenefit && <p className="text-text-secondary text-xs leading-relaxed">{nextBenefit}</p>}
            </div>
          </div>
          {Boolean(journey.nextStageRemaining) && (
            <p className="text-text-secondary text-xs">
              🎁 다음 단계까지 <span className="text-primary font-bold">{journey.nextStageRemaining}개</span> 남았어요
            </p>
          )}
        </div>

        {/* 열2 — 다음으로 해야 할 일 */}
        {nextAction && (
          <div className="flex flex-col gap-3 md:px-6">
            <p className="text-text-tertiary text-xs">다음으로 해야 할 일</p>
            <div className="flex-1 space-y-1">
              <p className="text-text-primary text-base font-bold">{nextAction.label}</p>
              {nextBenefit && <p className="text-text-tertiary text-xs leading-relaxed">{nextBenefit}</p>}
            </div>
            <Link
              href={buildHref(nextAction.targetTab, nextAction.targetAnchor)}
              className="bg-primary text-primary-foreground hover:bg-primary-emphasis group inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
            >
              등록하기
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        {/* 열3 — 남은 주요 항목 */}
        <div className="space-y-3 md:pl-6">
          <p className="text-text-tertiary text-xs">남은 주요 항목</p>
          <ul className="space-y-2">
            {missingItems.map((item, index) => (
              <motion.li
                key={item.key}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.06, duration: 0.3 }}
                className="border-border flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
              >
                <span className="text-text-primary min-w-0 truncate text-sm font-semibold">{item.label}</span>
                <Link
                  href={buildHref(item.targetTab, item.targetAnchor)}
                  className="border-primary text-primary hover:bg-primary-background group inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors"
                >
                  입력
                  <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
