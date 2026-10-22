"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Command as CommandPrimitive } from "cmdk";
import { Plus, Search, X } from "lucide-react";

import { type CrmPartnerType, PARTNER_SEARCH_MIN_LENGTH, useCrmPartnerSearch } from "@services/api/crm/crm.query";

import { useDebounce } from "@hooks/commons";

import { cn } from "@utils/shadcn";

import { type PartnerOption, toPartnerOptions } from "./progressView";

/** 「직접 추가」 항목의 값 — 검색 결과(워크스페이스 uid)와 겹치지 않게 */
const MANUAL_VALUE = "__manual";

/** 입력이 멈춘 뒤 검색한다 — 글자마다 요청하지 않게(스펙 권장 200~300ms) */
const SEARCH_DEBOUNCE_MS = 300;

/** 목록 항목 — 이름 + 「국가 · 카테고리」, 브랜드는 로고(없으면 이니셜) */
function PartnerOptionContent({ option }: { option: PartnerOption }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {option.logo && (
        <span className="border-border bg-accent flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md border text-xs font-bold">
          {option.logo.url ? (
            <img src={option.logo.url} alt="" className="size-full object-cover" />
          ) : (
            option.logo.initial
          )}
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <span className="text-text-primary truncate text-sm font-medium tracking-[-0.7px]">{option.name}</span>
        {option.meta && (
          <span className="text-text-tertiary truncate text-xs font-medium tracking-[-0.6px]">{option.meta}</span>
        )}
      </span>
    </span>
  );
}

type PartnerSearchFieldProps = {
  partnerType: CrmPartnerType;
  /** 「바이어」 또는 「브랜드」 */
  partnerLabel: string;
  selected: PartnerOption | null;
  onSelect: (option: PartnerOption | null) => void;
  /** 「목록에 없는 바이어 직접 추가」 — 지금까지 친 검색어를 넘긴다 */
  onManualAdd: (keyword: string) => void;
  errorText?: string;
};

/**
 * 「검색해서 추가」의 상대 검색 (피그마 693:1908).
 * 플랫폼에 가입한 상대를 이름으로 찾아 고른다 — 고른 상대의 워크스페이스와 진행 관리가 연결된다.
 * 방향키·엔터로 고를 수 있게 cmdk를 쓴다(목록 필터링은 서버가 하므로 끈다).
 */
export default function PartnerSearchField({
  partnerType,
  partnerLabel,
  selected,
  onSelect,
  onManualAdd,
  errorText,
}: PartnerSearchFieldProps) {
  const inputId = useId();
  const messageId = useId();

  const [keyword, setKeyword] = useState("");

  // 고르면 검색창이 사라져 포커스가 모달 전체로 튄다(모달 테두리에 포커스 선) — 「변경」 버튼으로 옮긴다
  const changeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (selected) {
      changeButtonRef.current?.focus();
    }
  }, [selected]);
  const trimmed = keyword.trim();
  const debounced = useDebounce(trimmed, SEARCH_DEBOUNCE_MS);
  const { data, isFetching, error } = useCrmPartnerSearch(partnerType, debounced);
  const options = data ? toPartnerOptions(data.items) : [];

  const isTooShort = trimmed.length > 0 && trimmed.length < PARTNER_SEARCH_MIN_LENGTH;
  // 친 글자와 받은 결과가 맞을 때만 「결과 없음」을 말한다 — 입력 중에 잠깐 보이는 옛 결과로 판단하지 않는다
  const isSettled = debounced === trimmed && !isFetching;
  const showList = trimmed.length >= PARTNER_SEARCH_MIN_LENGTH;

  // 방향키로 움직이는 강조 항목 — 결과가 바뀌면 첫 결과로 옮긴다.
  // 그대로 두면 결과가 오기 전 유일했던 「직접 추가」에 강조가 남아, 엔터 한 번에 직접 입력으로 넘어간다
  const firstValue = options[0] ? String(options[0].workspaceUid) : MANUAL_VALUE;
  const [activeValue, setActiveValue] = useState(firstValue);
  const [seenFirstValue, setSeenFirstValue] = useState(firstValue);
  if (firstValue !== seenFirstValue) {
    setSeenFirstValue(firstValue);
    setActiveValue(firstValue);
  }

  const message = errorText ?? (isTooShort ? `${PARTNER_SEARCH_MIN_LENGTH}글자 이상 입력해주세요` : undefined);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-text-primary text-sm font-medium tracking-[-0.7px]">
        {partnerLabel} 이름
        <span aria-hidden className="text-error ml-1">
          *
        </span>
      </label>

      {selected ? (
        // 고른 뒤에는 검색창 대신 고른 상대를 보여준다 — 「변경」으로 다시 찾는다
        <div className="border-border flex items-center justify-between gap-3 rounded-xl border px-3 py-2">
          <PartnerOptionContent option={selected} />
          <button
            ref={changeButtonRef}
            type="button"
            onClick={() => {
              onSelect(null);
              setKeyword("");
            }}
            aria-label={`${selected.name} 선택 취소`}
            className="text-text-tertiary hover:bg-secondary-background hover:text-text-primary focus-visible:ring-ring flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="size-3.5" aria-hidden />
            변경
          </button>
        </div>
      ) : (
        <CommandPrimitive
          shouldFilter={false}
          loop
          value={activeValue}
          onValueChange={setActiveValue}
          label={`${partnerLabel} 검색`}
          className="flex flex-col gap-2"
        >
          <div
            className={cn(
              "border-input focus-within:ring-ring/50 focus-within:border-ring flex h-10 items-center gap-2 rounded-xl border px-3 transition-[color,box-shadow] focus-within:ring-[3px]",
              message && errorText && "border-error",
            )}
          >
            <Search className="text-text-disabled size-4 shrink-0" aria-hidden />
            <CommandPrimitive.Input
              id={inputId}
              value={keyword}
              onValueChange={setKeyword}
              autoFocus
              placeholder={`${partnerLabel}명을 검색해주세요`}
              aria-describedby={message ? messageId : undefined}
              aria-invalid={Boolean(errorText)}
              className="placeholder:text-text-disabled h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          {showList && (
            <CommandPrimitive.List className="border-border max-h-[264px] overflow-y-auto rounded-xl border py-1">
              {error ? (
                <p className="text-error px-3 py-2.5 text-sm">{error.message}</p>
              ) : (
                <>
                  {options.map(option => (
                    <CommandPrimitive.Item
                      key={option.workspaceUid}
                      value={String(option.workspaceUid)}
                      onSelect={() => onSelect(option)}
                      className="data-[selected=true]:bg-secondary-background cursor-pointer px-3 py-2.5"
                    >
                      <PartnerOptionContent option={option} />
                    </CommandPrimitive.Item>
                  ))}

                  {options.length === 0 && (
                    <p className="text-text-tertiary px-3 py-2.5 text-sm">
                      {isSettled ? "검색 결과가 없어요" : "검색하고 있어요…"}
                    </p>
                  )}
                </>
              )}

              {/* 시안: 목록 맨 아래 — 찾는 상대가 플랫폼에 없을 때 */}
              <CommandPrimitive.Item
                value={MANUAL_VALUE}
                onSelect={() => onManualAdd(trimmed)}
                className="text-primary data-[selected=true]:bg-secondary-background flex cursor-pointer items-center gap-1.5 px-3 py-2.5 text-sm font-medium tracking-[-0.7px]"
              >
                <Plus className="size-4" aria-hidden />
                목록에 없는 {partnerLabel} 직접 추가
              </CommandPrimitive.Item>
            </CommandPrimitive.List>
          )}
        </CommandPrimitive>
      )}

      {message && (
        <p id={messageId} className={cn("text-xs", errorText ? "text-error" : "text-text-tertiary")}>
          {message}
        </p>
      )}
    </div>
  );
}
