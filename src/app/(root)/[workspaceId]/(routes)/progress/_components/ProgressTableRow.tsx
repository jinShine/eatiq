"use client";

import dayjs from "dayjs";
import { EllipsisVertical } from "lucide-react";

import { DropdownMenu, DropdownMenuItem } from "@components/ui";

import { cn } from "@utils/shadcn";

import StageBadge from "./StageBadge";
import { PROGRESS_GRID_COLS, type ProgressRow } from "./progressColumns";
import { CLOSED_STAGES, CONTRACT_TYPE_OPTIONS, COUNTRY_FILTER_OPTIONS } from "./progressOptions";

const EMPTY_CELL = "—";

/** 기한이 임박했다고 볼 남은 일수 */
const DUE_SOON_DAYS = 3;

type DueTone = "overdue" | "soon" | "normal";

// 기한 상태는 렌더 시점의 날짜로 계산한다.
// 서버가 계산해 내려주는 편이 안전하지만, 목록 API가 아직 없어 클라이언트에서 판단한다.
const resolveDueTone = (dueDate: string | null, isClosed: boolean): DueTone => {
  if (!dueDate || isClosed) {
    return "normal";
  }

  const diff = dayjs(dueDate).startOf("day").diff(dayjs().startOf("day"), "day");

  if (diff < 0) {
    return "overdue";
  }
  if (diff <= DUE_SOON_DAYS) {
    return "soon";
  }
  return "normal";
};

const DUE_TONE_CLASS: Record<DueTone, string> = {
  overdue: "text-[#dc2626] font-medium",
  soon: "text-[#d97700] font-medium",
  normal: "text-[#6b7280]",
};

const formatCellDate = (date: string | null) => (date ? dayjs(date).format("YYYY.MM.DD") : EMPTY_CELL);

const findContractLabel = (code: string) => CONTRACT_TYPE_OPTIONS.find(option => option.value === code)?.label ?? code;

const findCountryLabel = (code: string) => COUNTRY_FILTER_OPTIONS.find(option => option.value === code)?.label ?? code;

type ProgressTableRowProps = {
  row: ProgressRow;
};

export default function ProgressTableRow({ row }: ProgressTableRowProps) {
  const isClosed = CLOSED_STAGES.includes(row.stage);
  const dueTone = resolveDueTone(row.nextActionDueAt, isClosed);

  return (
    <div
      role="row"
      className={cn("group grid h-[50px] items-center px-6 transition-colors hover:bg-[#fafafb]", PROGRESS_GRID_COLS)}
    >
      <div role="cell" className="truncate pr-3 text-[13px] font-semibold text-[#111827]">
        {row.buyerName}
      </div>

      <div role="cell" className="truncate pr-3 text-[13px] text-[#6b7280]">
        {findCountryLabel(row.countryCode)} · {row.city}
      </div>

      <div role="cell" className="truncate pr-3 text-[13px] text-[#6b7280]">
        {findContractLabel(row.contractType)}
      </div>

      <div role="cell" className="pr-3">
        <StageBadge stage={row.stage} />
      </div>

      <div role="cell" className="pr-3 text-[13px] text-[#6b7280] tabular-nums">
        {formatCellDate(row.lastContactedAt)}
      </div>

      {/* 이 화면의 목적이 "다음에 할 일" 확인이라 이 열만 본문 색으로 끌어올린다 */}
      <div role="cell" className="truncate pr-3 text-[13px] text-[#111827]">
        {row.nextAction ?? EMPTY_CELL}
      </div>

      <div role="cell" className={cn("pr-3 text-[13px] tabular-nums", DUE_TONE_CLASS[dueTone])}>
        {formatCellDate(row.nextActionDueAt)}
        {dueTone === "overdue" && <span className="ml-1.5 text-[11px]">지연</span>}
      </div>

      <div role="cell" className="flex justify-end">
        <DropdownMenu
          align="end"
          trigger={
            <button
              type="button"
              aria-label={`${row.buyerName} 진행 관리 메뉴`}
              className="text-text-disabled hover:bg-secondary-background hover:text-text-secondary focus-visible:ring-ring flex size-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <EllipsisVertical className="size-4" />
            </button>
          }
        >
          {/* TODO(API): 진행 관리 API 연결 시 실제 동작을 붙인다 */}
          <DropdownMenuItem disabled>상세 보기</DropdownMenuItem>
          <DropdownMenuItem disabled>단계 변경</DropdownMenuItem>
          <DropdownMenuItem disabled variant="destructive">
            목록에서 제외
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
}
