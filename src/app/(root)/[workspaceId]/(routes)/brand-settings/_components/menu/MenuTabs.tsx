"use client";

import { useRef } from "react";

import { PlusIcon, Trash2Icon } from "lucide-react";

import { cn } from "@utils/shadcn";

type MenuTabsProps = {
  /** 탭 이름 — 한국어 메뉴 이름, 비어 있으면 "메뉴 N" */
  labels: string[];
  /** 검증 오류가 있는 탭. 다른 탭에 가려진 오류를 점으로 알린다 */
  invalid: boolean[];
  active: number;
  panelId: string;
  onSelect: (index: number) => void;
  /** 없으면 추가 탭을 숨긴다(최대 개수) */
  onAdd?: () => void;
  /** 없으면 삭제 버튼을 숨긴다(빈 메뉴 하나뿐일 때) */
  onRemove?: () => void;
};

const focusRing = "focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none";

/**
 * 메뉴 탭 (피그마 769:3871) — 메뉴 이름 탭 + 「+ 메뉴 N」.
 * 선택된 탭은 아래 테두리, 나머지는 회색 글자. 삭제 버튼은 시안에 없어 오른쪽 끝에 둔다.
 * 키보드: ←/→로 탭을 옮긴다(WAI-ARIA tabs 패턴).
 */
export default function MenuTabs({ labels, invalid, active, panelId, onSelect, onAdd, onRemove }: MenuTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) {
      return;
    }
    event.preventDefault();
    const next = (active + step + labels.length) % labels.length;
    onSelect(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="border-border flex h-16 items-center gap-1 overflow-x-auto border-b px-6">
      <div role="tablist" aria-label="대표 메뉴" className="flex h-full items-center gap-1" onKeyDown={handleKeyDown}>
        {labels.map((label, index) => {
          const isActive = index === active;
          return (
            <button
              key={index}
              ref={element => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(index)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 px-2 text-sm font-bold tracking-[-0.7px] whitespace-nowrap",
                focusRing,
                isActive
                  ? "border-text-primary text-text-primary -mb-px h-full border-b"
                  : "text-text-tertiary hover:bg-secondary-background h-9 rounded-lg",
              )}
            >
              <span className="max-w-40 truncate">{label}</span>
              {invalid[index] && (
                <>
                  <span aria-hidden className="bg-destructive size-1.5 shrink-0 rounded-full" />
                  <span className="sr-only">입력 오류 있음</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className={cn(
            "text-text-tertiary hover:bg-secondary-background flex h-9 shrink-0 items-center gap-0.5 rounded-lg px-2 text-sm font-bold tracking-[-0.7px] whitespace-nowrap",
            focusRing,
          )}
        >
          <PlusIcon aria-hidden className="size-3.5" strokeWidth={2.5} />
          메뉴 {labels.length + 1}
        </button>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "text-text-tertiary hover:text-destructive hover:bg-secondary-background ml-auto flex h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-sm font-medium whitespace-nowrap",
            focusRing,
          )}
        >
          <Trash2Icon aria-hidden className="size-4" />
          메뉴 삭제
        </button>
      )}
    </div>
  );
}
