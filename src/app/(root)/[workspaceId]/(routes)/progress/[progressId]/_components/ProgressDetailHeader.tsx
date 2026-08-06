"use client";

import Link from "next/link";

import { ArrowLeft, EllipsisVertical, Plus } from "lucide-react";

import { Button, DropdownMenu, DropdownMenuItem } from "@components/ui";

type ProgressDetailHeaderProps = {
  buyerName: string;
  country: string;
  city: string;
  /** 목록으로 돌아가는 경로 */
  backHref: string;
  onAddRecord?: () => void;
};

export default function ProgressDetailHeader({
  buyerName,
  country,
  city,
  backHref,
  onAddRecord,
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
          {buyerName} {country} · {city}
        </h2>

        <DropdownMenu
          align="start"
          trigger={
            <button
              type="button"
              aria-label={`${buyerName} 관리 메뉴`}
              className="text-text-disabled hover:bg-secondary-background hover:text-text-secondary focus-visible:ring-ring flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <EllipsisVertical className="size-4" />
            </button>
          }
        >
          {/* TODO(API): 상세 API 연결 시 실제 동작을 붙인다 */}
          <DropdownMenuItem disabled>바이어 정보 수정</DropdownMenuItem>
          <DropdownMenuItem disabled variant="destructive">
            목록에서 제외
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
