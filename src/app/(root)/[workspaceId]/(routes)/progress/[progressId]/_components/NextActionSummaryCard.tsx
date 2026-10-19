"use client";

import { useEffect, useRef, useState } from "react";

import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Switch } from "@components/ui";

import { cn } from "@utils/shadcn";

import { type NextActionSummary } from "./progressDetailView";

const PAGE_SIZE = 5;

/** 완료한 액션이 목록에서 빠지기까지 — 설계 노트 「완료되면 1초 후 리스트에서 빠져나감」. 그 사이 되돌릴 수 있다 */
const LEAVE_DELAY_MS = 1000;

type NextActionSummaryCardProps = {
  actions: NextActionSummary[];
  onToggle: (id: string, isDone: boolean) => void;
};

/**
 * 다음 액션 요약 — 남은 액션만 최신순으로 보여준다.
 * 완료로 바꾼 액션은 1초 동안 완료 모양으로 남았다가 빠진다.
 */
export default function NextActionSummaryCard({ actions: allActions, onToggle }: NextActionSummaryCardProps) {
  const [page, setPage] = useState(0);

  // 새 액션이 생기면(진행 기록 추가) 맨 앞 액션이 바뀐다 — 1페이지로 돌아가 방금 추가한 액션이 보이게 한다.
  // 렌더 중에 상태를 맞추는 방식(effect를 쓰면 옛 페이지가 한 번 그려진다)
  const newestId = allActions[0]?.id;
  const [seenNewestId, setSeenNewestId] = useState(newestId);
  if (newestId !== seenNewestId) {
    setSeenNewestId(newestId);
    setPage(0);
  }
  const shouldReduceMotion = useReducedMotion();

  // 방금 완료로 바꿔 아직 목록에 남겨 둘 액션
  const [leavingIds, setLeavingIds] = useState<Set<string>>(() => new Set());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(timer => clearTimeout(timer));
  }, []);

  const handleToggle = (id: string, isDone: boolean) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);

    if (isDone) {
      setLeavingIds(prev => new Set(prev).add(id));
      timers.current.set(
        id,
        setTimeout(() => {
          timers.current.delete(id);
          setLeavingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, LEAVE_DELAY_MS),
      );
    } else {
      setLeavingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    onToggle(id, isDone);
  };

  const actions = allActions.filter(action => !action.isDone || leavingIds.has(action.id));

  const totalPages = Math.max(1, Math.ceil(actions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visibleActions = actions.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-text-primary text-sm font-semibold">다음 액션 요약</h3>

      {actions.length === 0 ? (
        <p className="text-text-disabled text-xs">남은 다음 액션이 없어요.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {visibleActions.map(action => (
                <motion.li
                  key={action.id}
                  layout={!shouldReduceMotion}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3"
                >
                  <span className="text-text-disabled shrink-0 text-sm font-medium tracking-[-0.7px] tabular-nums">
                    {action.dueDate ? dayjs(action.dueDate).format("YYYY.MM.DD") : "기한 없음"}
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
                    onCheckedChange={checked => handleToggle(action.id, checked)}
                    aria-label={`${action.title} 완료 여부`}
                    className="shrink-0"
                  />
                </motion.li>
              ))}
            </AnimatePresence>
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
