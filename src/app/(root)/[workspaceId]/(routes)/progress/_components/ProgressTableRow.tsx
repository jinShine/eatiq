"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import dayjs from "dayjs";
import { EllipsisVertical } from "lucide-react";

import { DropdownMenu, DropdownMenuItem } from "@components/ui";

import { cn } from "@utils/shadcn";

import StageBadge from "./StageBadge";
import { PROGRESS_GRID_COLS } from "./progressColumns";
import { type ProgressRow } from "./progressView";

const EMPTY_CELL = "—";

const formatCellDate = (date: string | null) => (date ? dayjs(date).format("YYYY.MM.DD") : EMPTY_CELL);

type ProgressTableRowProps = {
  row: ProgressRow;
  onDelete: (row: ProgressRow) => void;
};

export default function ProgressTableRow({ row, onDelete }: ProgressTableRowProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const detailHref = `/${workspaceId}/progress/${row.id}`;

  return (
    <div
      role="row"
      className={cn("group grid h-[50px] items-center px-6 transition-colors hover:bg-[#fafafb]", PROGRESS_GRID_COLS)}
    >
      <div role="cell" className="min-w-0 pr-3">
        {/* 행 전체를 클릭 영역으로 만들면 케밥 버튼과 겹치므로 이름만 링크로 둔다 */}
        <Link
          href={detailHref}
          className="focus-visible:ring-ring block truncate rounded text-[13px] font-semibold text-[#111827] hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          {row.partnerName}
        </Link>
      </div>

      <div role="cell" className="truncate pr-3 text-[13px] text-[#6b7280]">
        {row.location || EMPTY_CELL}
      </div>

      <div role="cell" className="truncate pr-3 text-[13px] text-[#6b7280]">
        {row.contractType ?? EMPTY_CELL}
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

      {/* 기한 지남·임박 강조는 두지 않는다 — 경고 표시는 「방치」 배지로 통일(기획 확인 중) */}
      <div role="cell" className="pr-3 text-[13px] text-[#6b7280] tabular-nums">
        {formatCellDate(row.nextActionDueAt)}
      </div>

      <div role="cell" className="flex justify-end">
        <DropdownMenu
          align="end"
          trigger={
            <button
              type="button"
              aria-label={`${row.partnerName} 진행 관리 메뉴`}
              className="text-text-disabled hover:bg-secondary-background hover:text-text-secondary focus-visible:ring-ring flex size-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <EllipsisVertical className="size-4" />
            </button>
          }
        >
          <DropdownMenuItem asChild>
            <Link href={detailHref}>상세 보기</Link>
          </DropdownMenuItem>
          {/* 단계 변경은 시안상 상세 화면에서만 한다 */}
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete(row)}>
            삭제
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
}
