"use client";

import dayjs from "dayjs";
import { EllipsisVertical, Paperclip } from "lucide-react";

import { DropdownMenu, DropdownMenuItem } from "@components/ui";

import { cn } from "@utils/shadcn";

import { type ProgressRecord } from "./progressDetailView";
import { getActionTypeMeta } from "./recordOptions";

type ProgressTimelineItemProps = {
  record: ProgressRecord;
  onDelete: (record: ProgressRecord) => void;
};

/**
 * 진행 기록 카드 (피그마 693:2216).
 * 시안 카드 안의 「다음 액션」은 그리지 않는다 — API가 다음 액션이 어느 기록에서 나왔는지 주지 않는다(백엔드 요청).
 * 다음 액션은 왼쪽 「다음 액션 요약」에서 본다.
 */
export default function ProgressTimelineItem({ record, onDelete }: ProgressTimelineItemProps) {
  const meta = getActionTypeMeta(record.type);

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
          {record.partnerName && <span className="truncate text-[#6b7280]">· {record.partnerName}</span>}
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
          {/* 수정은 진행 기록 드로어(4단계)에서 붙인다 */}
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete(record)}>
            삭제
          </DropdownMenuItem>
        </DropdownMenu>
      </header>

      {/* 제목은 시안 카드에 없지만 등록 때 필수로 받는 값이라 보여준다 */}
      <h4 className="text-text-primary text-sm font-bold tracking-[-0.7px]">{record.title}</h4>

      {record.content && (
        <p className="text-sm leading-relaxed tracking-[-0.7px] whitespace-pre-line text-[#374151]">{record.content}</p>
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
    </article>
  );
}
