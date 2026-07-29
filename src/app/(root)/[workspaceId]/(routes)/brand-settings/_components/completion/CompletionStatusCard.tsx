"use client";

import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { ScrollArea, Skeleton } from "@components/ui";

import { type BrandSettingsTab, useBrandJourney } from "@services/api/brand/brand.query";

import CircularProgress from "./CircularProgress";
import JourneyStepper from "./JourneyStepper";
import { JOURNEY_STAGES, resolveStageIndex } from "./journeyStages";

// 피그마 기준 본문 높이 — 남은 항목이 늘어도 카드 높이를 고정하고 내부 스크롤
const BODY_HEIGHT = 146;

// 항목 56px + 간격 8px. 2.4개가 보이도록 잡아 다음 항목이 "반쯤 잘려" 스크롤을 암시
const MISSING_ITEM_HEIGHT = 56;
const MISSING_ITEM_GAP = 8;
const SCROLL_HEIGHT = MISSING_ITEM_HEIGHT * 2 + MISSING_ITEM_GAP * 2 + Math.round(MISSING_ITEM_HEIGHT * 0.4);

type CompletionStatusCardProps = {
  workspaceId: string;
  tab: BrandSettingsTab;
  tabLabel: string; // 제목에 붙는 탭 이름 — "정보 완성 현황 - 기본 정보"
};

export default function CompletionStatusCard({ workspaceId, tab, tabLabel }: CompletionStatusCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const { data: journey, isLoading } = useBrandJourney(workspaceId, tab);

  if (isLoading) {
    return (
      <div className="border-border border-b px-6 py-6">
        <Skeleton className="h-[218px] w-full rounded-xl" />
      </div>
    );
  }
  if (!journey) {
    return null;
  }

  const rate = journey.completionRate ?? 0;
  const stageIndex = resolveStageIndex(journey.journeyStage, rate);
  const { nextAction } = journey;

  // 다음 액션에 해당하는 혜택 문구 (targetAnchor ↔ itemKey 매칭)
  const nextBenefit = journey.benefits?.find(b => b.itemKey === nextAction?.targetAnchor)?.benefitText;

  // 필수 먼저 + sortOrder 순 (전체 노출 — 넘치면 내부 스크롤)
  const missingItems = [...(journey.missingItems ?? [])].sort(
    (a, b) => Number(b.isRequired) - Number(a.isRequired) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  const buildHref = (targetTab?: string, targetAnchor?: string) =>
    `/${workspaceId}/brand-settings?tab=${targetTab ?? tab}${targetAnchor ? `#${targetAnchor}` : ""}`;

  const focusRing =
    "focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

  // 스크롤 신호는 peek(다음 항목이 반쯤 잘림) + 상시 스크롤바로 충분 — 페이드는 텍스트 가독성을 해쳐 제외
  const scrollAreaStyle: React.CSSProperties = { height: SCROLL_HEIGHT };

  return (
    <section className="border-border border-b px-6 py-6">
      <h2 className="text-text-primary text-base font-bold tracking-tight">정보 완성 현황 - {tabLabel}</h2>

      {/* 스테퍼 — 전체 폭 */}
      <div className="mt-4">
        <JourneyStepper currentIndex={stageIndex} />
      </div>

      <div className="bg-border mt-4 h-px w-full" />

      {/* 3열 본문 — 수직 구분선으로 분할, 높이 고정 */}
      <div
        className="divide-border mt-4 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0 md:divide-x"
        style={{ minHeight: BODY_HEIGHT }}
      >
        {/* 열1 — 진행률 */}
        <div className="flex flex-col justify-between gap-4 md:pr-6">
          <div className="flex items-center gap-4">
            <CircularProgress rate={rate} label={`${tabLabel} 완성률`} />
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
              className={`bg-primary text-primary-foreground hover:bg-primary-emphasis group inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${focusRing}`}
            >
              등록하기
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        {/* 열3 — 남은 주요 항목 (총 개수 노출 + 내부 스크롤) */}
        <div className="flex min-w-0 flex-col gap-2 md:pl-6">
          <p className="text-text-tertiary text-xs">
            남은 주요 항목
            {missingItems.length > 0 && <span className="text-text-secondary font-bold"> {missingItems.length}</span>}
          </p>

          {missingItems.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-text-secondary text-sm font-semibold">모두 입력했어요 🎉</p>
            </div>
          ) : (
            <ScrollArea
              type="always" // 스크롤바 상시 노출 — hover 전에도 스크롤 가능함을 알림
              style={scrollAreaStyle}
              className="pr-3 [&_[data-slot=scroll-area-thumb]]:bg-text-disabled"
            >
              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {missingItems.map((item, index) => (
                    <motion.li
                      key={item.key}
                      layout
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, x: 12, height: 0, marginBottom: 0 }}
                      transition={{ delay: shouldReduceMotion ? 0 : Math.min(index, 6) * 0.05, duration: 0.28 }}
                      className="border-border flex items-center justify-between gap-3 overflow-hidden rounded-xl border px-4 py-3"
                    >
                      <span className="text-text-primary min-w-0 truncate text-sm font-semibold" title={item.label}>
                        {item.label}
                      </span>
                      <Link
                        href={buildHref(item.targetTab, item.targetAnchor)}
                        aria-label={`${item.label} 입력하기`}
                        className={`border-primary text-primary hover:bg-primary-background group inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${focusRing}`}
                      >
                        입력
                        <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </ScrollArea>
          )}
        </div>
      </div>
    </section>
  );
}
