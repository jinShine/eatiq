"use client";

import { useState } from "react";

import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Switch } from "@components/ui";

import { cn } from "@utils/shadcn";

import { type NextActionSummary } from "./progressDetailMock";

const PAGE_SIZE = 5;

type NextActionSummaryCardProps = {
  actions: NextActionSummary[];
  onToggle: (id: string, isDone: boolean) => void;
};

export default function NextActionSummaryCard({ actions, onToggle }: NextActionSummaryCardProps) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(actions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visibleActions = actions.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-text-primary text-sm font-semibold">다음 액션 요약</h3>

      {actions.length === 0 ? (
        <p className="text-text-disabled text-xs">등록된 다음 액션이 없어요.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {visibleActions.map(action => (
              <li key={action.id} className="flex items-center gap-3">
                <span className="text-text-disabled shrink-0 text-sm font-medium tracking-[-0.7px] tabular-nums">
                  {dayjs(action.dueDate).format("YYYY.MM.DD")}
                </span>

                {/* 완료된 액션은 흐리게 두어 남은 일이 먼저 읽히게 한다 */}
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm font-medium tracking-[-0.7px]",
                    action.isDone ? "text-text-disabled line-through" : "text-text-primary",
                  )}
                  title={action.title}
                >
                  {action.title}
                </span>

                <Switch
                  checked={action.isDone}
                  onCheckedChange={checked => onToggle(action.id, checked)}
                  aria-label={`${action.title} 완료 여부`}
                  className="shrink-0"
                />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav className="text-text-disabled flex items-center gap-1 text-xs" aria-label="다음 액션 페이지">
              <button
                type="button"
                onClick={() => setPage(safePage - 1)}
                disabled={safePage === 0}
                aria-label="이전 페이지"
                className="hover:text-text-secondary flex size-5 items-center justify-center rounded transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index)}
                  aria-current={index === safePage ? "page" : undefined}
                  className={cn(
                    "flex size-5 items-center justify-center rounded transition-colors",
                    index === safePage ? "text-text-primary font-semibold" : "hover:text-text-secondary",
                  )}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage(safePage + 1)}
                disabled={safePage === totalPages - 1}
                aria-label="다음 페이지"
                className="hover:text-text-secondary flex size-5 items-center justify-center rounded transition-colors disabled:opacity-40"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
