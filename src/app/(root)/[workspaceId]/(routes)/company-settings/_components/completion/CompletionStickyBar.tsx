"use client";

import { ArrowRightIcon } from "lucide-react";

import { cn } from "@utils/shadcn";

import CircularProgress from "./CircularProgress";
import { type CompletionTaskView, focusRing } from "./CompletionPanel";
import { type JourneyStage } from "./journeyStages";

type CompletionStickyBarProps = {
  stages: readonly JourneyStage[];
  stageIndex: number;
  step: string;
  rate: number;
  nextTask: CompletionTaskView;
  progressLabel: string;
  onGo: (task: CompletionTaskView) => void;
};

/**
 * 저니 패널 「스크롤 시」 바 (피그마 769:4487) — 큰 패널이 화면 밖으로 나가면 헤더 아래에 붙는다.
 *
 * 작은 원 · 단계 · % · 단계 막대 · 다음으로 해야 할 일 · 등록하기.
 * 단계 막대는 단계 수만큼 칸을 두고 지금 단계까지 채운다(시안: 준비 = 4칸 중 3칸).
 * 좁은 화면에선 막대와 「다음으로 해야 할 일」 문구를 숨겨 원 · 단계 · 버튼만 남긴다.
 */
export default function CompletionStickyBar({
  stages,
  stageIndex,
  step,
  rate,
  nextTask,
  progressLabel,
  onGo,
}: CompletionStickyBarProps) {
  return (
    <div className="border-border flex items-center gap-3 rounded-lg border bg-white px-4 py-2.5 sm:px-6">
      <div className="flex shrink-0 items-center gap-3">
        <CircularProgress rate={rate} size={32} strokeWidth={4} showValue={false} label={progressLabel} />
        <p className="text-primary text-sm font-bold tracking-[-0.7px]">{step}</p>
        <p className="text-text-primary text-sm font-medium tracking-[-0.7px]">{rate}%</p>
      </div>

      <ol aria-label={`${stages.length}단계 중 ${stageIndex + 1}단계`} className="hidden shrink-0 gap-1 px-3 md:flex">
        {stages.map((stage, index) => (
          <li
            key={stage.step}
            className={cn("h-1 w-7 rounded-full", index <= stageIndex ? "bg-primary" : "bg-gray-300")}
          />
        ))}
      </ol>

      {/* 넓이가 모자라면 할 일 이름을 말줄임한다 */}
      <p className="hidden min-w-0 flex-1 items-center gap-1 text-sm tracking-[-0.7px] md:flex">
        <span className="text-text-tertiary shrink-0 font-medium">다음으로 해야 할 일 :</span>
        <span className="text-text-primary truncate font-bold" title={nextTask.title}>
          {nextTask.title}
        </span>
      </p>

      <button
        type="button"
        onClick={() => onGo(nextTask)}
        aria-label={`${nextTask.title} 등록하기`}
        className={`bg-primary text-primary-foreground hover:bg-primary-emphasis group ml-auto inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${focusRing}`}
      >
        등록하기
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
