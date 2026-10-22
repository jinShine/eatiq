"use client";

import { useState } from "react";

import dayjs from "dayjs";
import { ChevronDown, EllipsisVertical, Paperclip } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DropdownMenu, DropdownMenuItem, Switch } from "@components/ui";

import { cn } from "@utils/shadcn";

import { type ProgressRecord, type RecordNextAction } from "./progressDetailView";
import { getActionTypeMeta } from "./recordOptions";

/** 라벨 - 값 한 줄 (시안: 라벨 회색 · 값 오른쪽 정렬) */
function ActionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm font-medium tracking-[-0.7px]">
      <dt className="shrink-0 text-[#9ca3aa]">{label}</dt>
      <dd className="text-text-primary min-w-0 text-right break-words">{children}</dd>
    </div>
  );
}

type NextActionBlockProps = {
  order: number;
  item: RecordNextAction;
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
  onToggleDone: (isDone: boolean) => void;
};

/** 카드 안 「다음 액션 N」 — 하나씩 접고 펼친다 (피그마 693:2333) */
function NextActionBlock({ order, item, isExpanded, onExpandedChange, onToggleDone }: NextActionBlockProps) {
  const shouldReduceMotion = useReducedMotion();
  const panelId = `next-action-${order}-${item.idx}`;

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => onExpandedChange(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="text-text-primary hover:bg-secondary-background focus-visible:ring-ring -mx-1 flex w-fit items-center gap-1 rounded-lg px-1 py-1 text-sm font-medium tracking-[-0.7px] transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <ChevronDown
          aria-hidden
          className={cn("size-4 transition-transform duration-200", !isExpanded && "-rotate-90")}
        />
        다음 액션 {order}
        {/* 접혀 있어도 끝냈는지 보이게 — 시안에는 없다 */}
        {item.isDone && (
          <span className="ml-1 rounded bg-[#ecfdf5] px-1.5 py-0.5 text-[11px] font-medium text-[#059669]">완료</span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={panelId}
            key="panel"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            // 공간이 먼저 열리고 내용이 뒤따라 밝아지도록 속성별 타이밍을 나눈다
            transition={{
              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.18, ease: "linear" },
            }}
            className="overflow-hidden"
          >
            <dl className="flex flex-col gap-2 pt-2">
              <ActionRow label="액션">{item.title}</ActionRow>
              <ActionRow label="기한">
                <span className="tabular-nums">
                  {item.dueDate ? dayjs(item.dueDate).format("YYYY.MM.DD") : "기한 없음"}
                </span>
              </ActionRow>
              <ActionRow label="담당자">{item.assignee ?? "-"}</ActionRow>
              {/* 메모는 시안에 없지만 드로어에서 받는 값이라 있을 때만 보여준다 */}
              {item.memo && <ActionRow label="메모">{item.memo}</ActionRow>}
              <ActionRow label="완료">
                <Switch checked={item.isDone} onCheckedChange={onToggleDone} aria-label={`${item.title} 완료 여부`} />
              </ActionRow>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type ProgressTimelineItemProps = {
  record: ProgressRecord;
  onEdit: (record: ProgressRecord) => void;
  onDelete: (record: ProgressRecord) => void;
  onToggleAction: (record: ProgressRecord, item: RecordNextAction, isDone: boolean) => void;
};

/**
 * 진행 기록 카드 (피그마 693:2324).
 * 다음 액션은 기록 안에 들어 있어(2026-10-20 구조 변경) 시안대로 카드 안에 하나씩 접고 펼치게 그린다.
 * 처음에는 남은 액션만 펼쳐 둔다 — 끝낸 액션은 접는다.
 * 액션 하나만 지우는 버튼은 시안에 없어 두지 않는다(수정 드로어의 「액션 삭제」로 지운다).
 */
export default function ProgressTimelineItem({ record, onEdit, onDelete, onToggleAction }: ProgressTimelineItemProps) {
  const meta = getActionTypeMeta(record.type);

  // 접어 둔 액션 번호 — 처음 그릴 때만 완료 여부로 정하고, 그다음은 사용자가 여닫는 대로 둔다
  const [collapsedIdx, setCollapsedIdx] = useState<Set<number>>(
    () => new Set(record.nextActions.filter(item => item.isDone).map(item => item.idx)),
  );

  const setExpanded = (idx: number, isExpanded: boolean) =>
    setCollapsedIdx(prev => {
      const next = new Set(prev);
      if (isExpanded) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });

  return (
    <article className="border-border flex flex-col gap-3 rounded-xl border bg-white p-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium tracking-[-0.7px]">
          <span className={cn("size-2.5 shrink-0 rounded-full", meta.dotClassName)} aria-hidden />
          <span className="text-text-primary shrink-0">{meta.label}</span>
          {record.occurredAt && (
            <span className="shrink-0 text-[#6b7280] tabular-nums">
              · {dayjs(record.occurredAt).format("YYYY.MM.DD")}
            </span>
          )}
        </div>

        <DropdownMenu
          align="end"
          trigger={
            <button
              type="button"
              aria-label={`${record.title} 기록 메뉴`}
              className="text-text-disabled hover:bg-secondary-background hover:text-text-secondary focus-visible:ring-ring flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <EllipsisVertical className="size-4" />
            </button>
          }
        >
          <DropdownMenuItem onSelect={() => onEdit(record)}>수정</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete(record)}>
            삭제
          </DropdownMenuItem>
        </DropdownMenu>
      </header>

      <h4 className="text-lg font-bold tracking-[-0.9px] text-[#374151]">{record.title}</h4>

      {record.content && (
        <p className="text-sm leading-relaxed font-medium tracking-[-0.7px] whitespace-pre-line text-[#374151]">
          {record.content}
        </p>
      )}

      {record.files.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {record.files.map(file => (
            <li key={file.url}>
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer noopener"
                className="border-border text-text-secondary hover:text-text-primary focus-visible:ring-ring flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <Paperclip className="size-3.5" aria-hidden />
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      )}

      {record.nextActions.length > 0 && (
        <>
          <div className="h-px bg-[#e5e7ea]" />
          <div className="flex flex-col gap-3">
            {record.nextActions.map((item, index) => (
              <NextActionBlock
                key={item.idx}
                order={index + 1}
                item={item}
                isExpanded={!collapsedIdx.has(item.idx)}
                onExpandedChange={isExpanded => setExpanded(item.idx, isExpanded)}
                onToggleDone={isDone => onToggleAction(record, item, isDone)}
              />
            ))}
          </div>
        </>
      )}
    </article>
  );
}
