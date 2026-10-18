"use client";

import Link from "next/link";

import { ArrowLeft, EllipsisVertical, Plus } from "lucide-react";

import { Button, DropdownMenu, DropdownMenuItem } from "@components/ui";

type ProgressDetailHeaderProps = {
  partnerName: string;
  /** 「일본 · 도쿄」 — 둘 다 비면 빈 문자열 */
  location: string;
  /** 목록으로 돌아가는 경로 */
  backHref: string;
  onAddRecord?: () => void;
  onDelete: () => void;
};

export default function ProgressDetailHeader({
  partnerName,
  location,
  backHref,
  onAddRecord,
  onDelete,
}: ProgressDetailHeaderProps) {
  return (
    <div className="border-border flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6">
      <div className="flex min-w-0 items-center gap-3">
        {/* 시안에는 없지만 상세로 들어온 경로를 되짚을 수단이 필요하다 */}
        <Link
          href={backHref}
          aria-label="진행 관리 목록으로"
          className="text-text-tertiary hover:bg-secondary-background hover:text-text-primary focus-visible:ring-ring flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <h2 className="text-text-primary truncate text-[22px] font-bold tracking-[-1.1px]">
          {partnerName} {location}
        </h2>

        <DropdownMenu
          align="start"
          trigger={
            <button
              type="button"
              aria-label={`${partnerName} 관리 메뉴`}
              className="text-text-disabled hover:bg-secondary-background hover:text-text-secondary focus-visible:ring-ring flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <EllipsisVertical className="size-4" />
            </button>
          }
        >
          {/* 기본 정보 수정은 API가 없어 두지 않는다 */}
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>
            삭제
          </DropdownMenuItem>
        </DropdownMenu>
      </div>

      <Button size="sm" className="shrink-0" onClick={onAddRecord}>
        <Plus className="size-3.5" />
        진행 기록 추가
      </Button>
    </div>
  );
}
