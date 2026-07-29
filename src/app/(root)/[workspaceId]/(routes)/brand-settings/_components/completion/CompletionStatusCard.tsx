"use client";

import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Skeleton } from "@components/ui";

import { type BrandSettingsTab, useBrandJourney } from "@services/api/brand/brand.query";

import CircularProgress from "./CircularProgress";
import JourneyStepper from "./JourneyStepper";
import { JOURNEY_STAGES, resolveStageIndex } from "./journeyStages";

const MISSING_ITEMS_LIMIT = 5;

type CompletionStatusCardProps = {
  workspaceId: string;
  tab: BrandSettingsTab;
};

export default function CompletionStatusCard({ workspaceId, tab }: CompletionStatusCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const { data: journey, isLoading } = useBrandJourney(workspaceId, tab);

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-2xl" />;
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
    <section className="border-border space-y-5 rounded-2xl border p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-text-primary text-base font-bold tracking-tight">정보 완성 현황</h2>
        <JourneyStepper currentIndex={stageIndex} />
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        {/* 좌: 원형 진행률 */}
        <div className="flex items-center gap-4">
          <CircularProgress rate={rate} />
          <div className="space-y-1">
            <p className="text-primary text-sm font-bold">{JOURNEY_STAGES[stageIndex].label} 단계</p>
            {nextBenefit && <p className="text-text-tertiary max-w-[220px] text-xs leading-relaxed">{nextBenefit}</p>}
            {Boolean(journey.nextStageRemaining) && (
              <p className="text-text-secondary text-xs">
                다음 단계까지 <span className="text-primary font-bold">{journey.nextStageRemaining}개</span> 남았어요
              </p>
            )}
          </div>
        </div>

        {/* 우: 다음 액션 + 남은 항목 */}
        <div className="flex-1 space-y-3">
          {nextAction && (
            <Link
              href={buildHref(nextAction.targetTab, nextAction.targetAnchor)}
              className="bg-primary-background hover:bg-primary-light group flex items-center justify-between rounded-xl px-4 py-3 transition-colors"
            >
              <span className="min-w-0">
                <span className="text-text-tertiary block text-[11px] font-semibold">다음으로 해야 할 일</span>
                <span className="text-text-primary block truncate text-sm font-bold">{nextAction.label}</span>
              </span>
              <ArrowRightIcon className="text-primary size-4 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          {missingItems.length > 0 && (
            <ul className="space-y-1">
              {missingItems.map((item, index) => (
                <motion.li
                  key={item.key}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : index * 0.06, duration: 0.3 }}
                >
                  <Link
                    href={buildHref(item.targetTab, item.targetAnchor)}
                    className="hover:bg-accent group flex items-center justify-between rounded-lg px-3 py-2 transition-colors"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="text-text-secondary truncate text-sm">{item.label}</span>
                      {item.isRequired && (
                        <span className="text-error bg-destructive-background shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold">
                          필수
                        </span>
                      )}
                    </span>
                    <span className="text-text-tertiary group-hover:text-primary shrink-0 text-xs transition-colors">
                      입력 →
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
