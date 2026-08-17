"use client";

import { useState } from "react";

import dayjs from "dayjs";
import { ChevronDown, EllipsisVertical } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DropdownMenu, DropdownMenuItem, Switch } from "@components/ui";

import { cn } from "@utils/shadcn";

import { type ProgressRecord } from "./progressDetailMock";
import { RECORD_TYPE_META } from "./recordOptions";

type ProgressTimelineItemProps = {
  record: ProgressRecord;
  onToggleAction: (recordId: string, isDone: boolean) => void;
};

export default function ProgressTimelineItem({ record, onToggleAction }: ProgressTimelineItemProps) {
  // 시안은 펼쳐진 상태가 기본이다
  const [isExpanded, setIsExpanded] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const meta = RECORD_TYPE_META[record.type];
  const { nextAction } = record;

  return (
    <article className="border-border flex flex-col gap-3 rounded-xl border bg-white p-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("size-2.5 shrink-0 rounded-full", meta.dotClassName)} aria-hidden />
          <span className="text-text-primary text-sm font-medium tracking-[-0.7px]">{meta.label}</span>
          <span className="text-sm font-medium tracking-[-0.7px] text-[#6b7280]">
            · {dayjs(record.occurredAt).format("YYYY.MM.DD")}
          </span>
        </div>

        <DropdownMenu
          align="end"
          trigger={
            <button
              type="button"
              aria-label={`${meta.label} 기록 메뉴`}
              className="text-text-disabled hover:bg-secondary-background hover:text-text-secondary focus-visible:ring-ring flex size-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <EllipsisVertical className="size-4" />
            </button>
          }
        >
          {/* TODO(API): 진행 기록 API 연결 시 동작을 붙인다 */}
          <DropdownMenuItem disabled>기록 수정</DropdownMenuItem>
          <DropdownMenuItem disabled variant="destructive">
            기록 삭제
          </DropdownMenuItem>
        </DropdownMenu>
      </header>

      <p className="text-sm leading-relaxed tracking-[-0.7px] text-[#374151]">{record.content}</p>

      {/* 다음 액션이 없는 기록은 접이식 영역 자체를 만들지 않는다 */}
      {nextAction && (
        <>
          <div className="bg-border h-px" />

          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            aria-expanded={isExpanded}
            className="text-text-primary hover:bg-secondary-background focus-visible:ring-ring -mx-1 flex w-fit items-center gap-1 rounded-lg px-1 py-1 text-sm font-medium tracking-[-0.7px] transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronDown
              className={cn("size-4 transition-transform duration-200", isExpanded && "rotate-180")}
              aria-hidden
            />
            다음 액션
          </button>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="next-action"
                // 카드가 gap-3(12px)이라 height만 0으로 접으면 여백이 남는다. margin으로 상쇄한다
                initial={shouldReduceMotion ? false : { height: 0, opacity: 0, marginTop: -12 }}
                animate={{ height: "auto", opacity: 1, marginTop: 0 }}
                exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0, marginTop: -12 }}
                // 공간이 먼저 열리고 내용이 뒤따라 밝아지도록 속성별 타이밍을 나눈다
                transition={{
                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  marginTop: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.18, ease: "linear" },
                }}
                className="overflow-hidden"
              >
                <dl className="flex flex-col gap-2 text-sm font-medium tracking-[-0.7px]">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-disabled shrink-0">액션</dt>
                    <dd className="text-text-primary min-w-0 truncate text-right">{nextAction.title}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-disabled shrink-0">기한</dt>
                    <dd className="text-text-primary tabular-nums">{dayjs(nextAction.dueDate).format("YYYY.MM.DD")}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-disabled shrink-0">담당자</dt>
                    <dd className="text-text-primary min-w-0 truncate text-right">{nextAction.assignee}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-disabled shrink-0">완료</dt>
                    <dd>
                      <Switch
                        checked={nextAction.isDone}
                        onCheckedChange={checked => onToggleAction(record.id, checked)}
                        aria-label={`${nextAction.title} 완료 여부`}
                      />
                    </dd>
                  </div>
                </dl>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </article>
  );
}
