"use client";

import { useEffect, useRef, useState } from "react";

import { ArrowRightIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Skeleton } from "@components/ui";

import CircularProgress from "./CircularProgress";
import CompletionStickyBar from "./CompletionStickyBar";
import JourneyStepper from "./JourneyStepper";
import { type JourneyStage, countToNextStage, toStageIndex } from "./journeyStages";

/** 다음 할 일·남은 항목 한 칸 — 브랜드·바이어 완성도 뷰모델이 같은 모양이다 */
export type CompletionTaskView = {
  title: string;
  description: string;
  isRequired: boolean;
  /** 이동할 섹션 — 화면 섹션의 id */
  sectionKey: string;
  /** 포커스할 필드 — 폼 필드 이름(DTO 필드명)과 같다 */
  fieldKey: string;
};

export type CompletionView = {
  rate: number;
  totalFields: number;
  completedFields: number;
  step: string;
  stepMessage: string;
  nextTask: CompletionTaskView | null;
  remainingTasks: CompletionTaskView[];
};

// 피그마 기준 본문 높이 — 남은 항목이 늘어도 카드 높이를 고정하고 내부 스크롤
const BODY_HEIGHT = 146;

// 남은 주요 항목은 앞에서부터 3개만 스크롤 없이 보여준다(기획 2026-11-18). 하나를 채우면 다음 항목이 올라온다
const VISIBLE_REMAINING = 3;

/** 위에 붙어 있는 PageHeader 실제 높이(px) — PageHeaderHeightSync가 --page-header-h로 알려 준다 */
const readHeaderHeight = () => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--page-header-h").trim();
  const value = parseFloat(raw);
  if (Number.isNaN(value)) {
    return 64;
  }
  // 재기 전 기본값은 rem(4rem)이다
  return raw.endsWith("rem") ? value * 16 : value;
};

/**
 * 큰 패널이 헤더 아래로 완전히 사라졌는지.
 * scroll 이벤트는 스크롤마다 수십 번 불려 IntersectionObserver로 「보이는지」만 받는다.
 * 헤더에 가린 부분은 안 보이는 것이라 위쪽 감지 범위를 헤더 높이만큼 줄인다
 */
function useIsScrolledPast(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) {
      return;
    }
    const headerHeight = readHeaderHeight();
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 아래로 지나간 경우만 — 패널이 화면 아래쪽에 있을 때(맨 위가 아직 안 온 경우)는 붙이지 않는다
        setIsPast(!entry.isIntersecting && entry.boundingClientRect.top < headerHeight);
      },
      { rootMargin: `-${headerHeight}px 0px 0px 0px` },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, enabled]);

  return enabled && isPast;
}

export const focusRing =
  "focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

/**
 * 남은 항목의 「입력」을 누르면 그 섹션으로 내려가 해당 입력칸에 바로 포커스한다.
 *
 * 서버가 주는 field_key가 폼 필드 이름(저장 DTO 필드명)과 같아 name으로 찾을 수 있다.
 * 목록 항목(대표 메뉴)은 이름이 "menu_list.0.name_ko"처럼 붙어 있어 끝이 같은 칸도 찾는다 — 화면에 보이는 첫 칸.
 * 섹션은 section_key를 id로 갖는다. 아직 연결 안 된 섹션이면 스크롤만 되고 포커스는 건너뛴다.
 */
const goToField = (task: CompletionTaskView) => {
  const section = document.getElementById(task.sectionKey);
  if (!section) {
    return;
  }
  section.scrollIntoView({ behavior: "smooth", block: "start" });
  section
    .querySelector<HTMLElement>(`[name="${task.fieldKey}"], [name$=".${task.fieldKey}"]`)
    ?.focus({ preventScroll: true });
};

export function CompletionPanelSkeleton() {
  return (
    <div className="border-border border-b px-6 py-6">
      <Skeleton className="h-[218px] w-full rounded-xl" />
    </div>
  );
}

type CompletionPanelProps = {
  title: string;
  completion: CompletionView;
  stages: readonly JourneyStage[];
  /** 진행률 원의 접근성 이름 — "기본 정보 완성률" */
  progressLabel: string;
};

/**
 * 정보 완성 현황(저니 패널) 화면 — 진행률 · 다음으로 해야 할 일 · 남은 주요 항목.
 * 다 채우면(다음으로 해야 할 일이 없으면) 제목과 스테퍼만 남기고 본문을 접는다(피그마 769:4565 「모든 패널 입력 완료 시」).
 * 브랜드는 탭마다, 바이어는 페이지 전체 기준이다
 */
export default function CompletionPanel({ title, completion, stages, progressLabel }: CompletionPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  // 할 일이 남았을 때만 스크롤 바를 띄운다 — 다 채웠으면 따라다닐 이유가 없다
  const showStickyBar = useIsScrolledPast(panelRef, Boolean(completion.nextTask));

  const { rate, nextTask, remainingTasks } = completion;
  const stageIndex = toStageIndex(stages, completion.step);
  const toNextStage = countToNextStage(stages, stageIndex, completion.totalFields, completion.completedFields);

  // 스크롤 신호는 peek(다음 항목이 반쯤 잘림) + 상시 스크롤바로 충분 — 페이드는 텍스트 가독성을 해쳐 제외
  const visibleTasks = remainingTasks.slice(0, VISIBLE_REMAINING);
  // 더 남았는지 알 수 있게 나머지 개수만 제목 옆에 적는다(목록은 3개 그대로).
  // 서버는 remaining_tasks를 최대 3개만 주므로 목록 길이로는 셀 수 없다 —
  // 전체 미입력 수(총 항목 − 입력한 항목)에서 다음으로 해야 할 일과 보이는 목록을 뺀다
  const missingCount = completion.totalFields - completion.completedFields;
  const hiddenCount = Math.max(0, missingCount - 1 - visibleTasks.length);

  return (
    <>
      <section ref={panelRef} className="border-border border-b px-6 py-6">
        <h2 className="text-text-primary text-base font-bold tracking-tight">{title}</h2>

        {/* 스테퍼 — 전체 폭 */}
        <div className="mt-4">
          <JourneyStepper stages={stages} currentIndex={stageIndex} />
        </div>

        {nextTask && (
          <>
            <div className="bg-border mt-4 h-px w-full" />

            {/* 3열 본문 — 수직 구분선으로 분할, 높이 고정.
          사이드바를 뺀 폭이 1000px 정도는 돼야 세 열이 줄바꿈 없이 들어간다. 그보다 좁으면 세로로 쌓는다 */}
            <div
              className="divide-border mt-4 grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-0 xl:divide-x"
              style={{ minHeight: BODY_HEIGHT }}
            >
              {/* 열1 — 진행률 */}
              <div className="flex flex-col justify-between gap-4 xl:pr-6">
                <div className="flex items-center gap-4">
                  <CircularProgress rate={rate} label={progressLabel} />
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-bold">
                      <span className="text-primary">{stages[stageIndex]?.step ?? completion.step}</span>
                      <span className="text-text-primary"> 단계</span>
                    </p>
                    <p className="text-text-secondary text-xs leading-relaxed whitespace-pre-line">
                      {completion.stepMessage}
                    </p>
                  </div>
                </div>
                {toNextStage && (
                  <p className="text-text-secondary text-xs">
                    🎁 다음 단계까지 <span className="text-primary font-bold">{toNextStage}개</span> 남았어요
                  </p>
                )}
              </div>

              {/* 열2 — 다음으로 해야 할 일 */}
              <div className="flex flex-col gap-3 xl:px-6">
                <p className="text-text-tertiary text-xs">다음으로 해야 할 일</p>
                <div className="flex-1 space-y-1">
                  <p className="text-text-primary text-base font-bold">{nextTask.title}</p>
                  <p className="text-text-tertiary text-xs leading-relaxed">{nextTask.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => goToField(nextTask)}
                  className={`bg-primary text-primary-foreground hover:bg-primary-emphasis group inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${focusRing}`}
                >
                  등록하기
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {/* 열3 — 남은 주요 항목 (몇 개가 남아도 앞의 3개만 + 나머지 개수) */}
              <div className="flex min-w-0 flex-col gap-2 xl:pl-6">
                <p className="text-text-tertiary text-xs">
                  남은 주요 항목
                  {hiddenCount > 0 && <span className="text-text-disabled"> · 외 {hiddenCount}개</span>}
                </p>

                {/* remaining_tasks는 next_task를 뺀 목록이다. 비어 있으면 다음으로 해야 할 일 하나만 남은 것 */}
                {remainingTasks.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-text-secondary text-sm font-semibold">다음으로 해야 할 일만 남았어요</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    <AnimatePresence initial={false}>
                      {visibleTasks.map((item, index) => (
                        <motion.li
                          key={`${item.sectionKey}.${item.fieldKey}`}
                          layout
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={shouldReduceMotion ? undefined : { opacity: 0, x: 12, height: 0, marginBottom: 0 }}
                          transition={{ delay: shouldReduceMotion ? 0 : Math.min(index, 6) * 0.05, duration: 0.28 }}
                          className="border-border flex items-center justify-between gap-3 overflow-hidden rounded-xl border px-4 py-3"
                        >
                          <span className="text-text-primary min-w-0 truncate text-sm font-semibold" title={item.title}>
                            {item.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => goToField(item)}
                            aria-label={`${item.title} 입력하기`}
                            className={`border-primary text-primary hover:bg-primary-background group inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${focusRing}`}
                          >
                            입력
                            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {/* 스크롤 시 바 — 큰 패널을 줄이지 않고 따로 띄운다. 패널 높이가 바뀌면 아래 내용이 당겨져
        패널이 다시 보이고, 다시 커지는 깜빡임이 생긴다.
        높이 0인 sticky 칸에 겹쳐 그려 레이아웃을 전혀 밀지 않는다(이 칸의 부모 = 탭 전체라 끝까지 붙어 있다) */}
      <div className="sticky top-(--page-header-h) z-20 h-0">
        <AnimatePresence>
          {showStickyBar && nextTask && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              // 시안: 흰 띠(위아래 24px) 안에 테두리 카드 — 띠 높이 108px
              className="border-border bg-background border-b px-6 py-6"
            >
              <CompletionStickyBar
                stages={stages}
                stageIndex={stageIndex}
                step={stages[stageIndex]?.step ?? completion.step}
                rate={rate}
                nextTask={nextTask}
                progressLabel={progressLabel}
                onGo={goToField}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
