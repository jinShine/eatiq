"use client";

import { ExternalLink, Sparkles } from "lucide-react";

import { Button } from "@components/ui";

import { type BuyerRow } from "./buyerMock";

type BuyerListItemProps = {
  buyer: BuyerRow;
  onOpenDetail: (buyerId: string) => void;
};

export default function BuyerListItem({ buyer, onOpenDetail }: BuyerListItemProps) {
  const initial = buyer.name.charAt(0).toUpperCase();

  return (
    <li className="border-border border-b bg-white px-7 py-[18px]">
      <div className="flex items-start gap-4">
        {/* 이니셜 아바타 */}
        <div className="border-border bg-accent flex size-[60px] shrink-0 items-center justify-center rounded-lg border">
          <span className="text-text-primary text-[28px] leading-none font-bold tracking-[-1.4px]">{initial}</span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* 회사명 + 외부 링크 */}
          <div className="flex items-center gap-2">
            <h3 className="text-text-primary truncate text-lg font-bold tracking-[-0.9px]">{buyer.name}</h3>
            {buyer.websiteUrl && (
              <a
                href={buyer.websiteUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${buyer.name} 웹사이트 열기`}
                className="text-text-disabled hover:text-primary focus-visible:ring-ring shrink-0 rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>

          <p className="text-text-tertiary text-sm font-medium tracking-[-0.7px]">{buyer.summary}</p>

          <p className="text-text-tertiary text-[11px] font-bold tracking-[-0.55px]">
            운영 브랜드 : {buyer.operatingBrands.join(" · ")}
          </p>

          <p className="text-text-disabled text-[11px] font-medium tracking-[-0.55px]">
            {buyer.scaleLabel}
            {buyer.hasKoreanBrandExperience && <span className="text-success"> · 한국 브랜드 경험</span>}
          </p>

          {/* 조건 부합 바이어 — 추천 사유가 있을 때만 */}
          {buyer.matchReason && (
            <div className="bg-primary-50 mt-1 flex w-fit items-start gap-2 rounded-lg p-1">
              <span className="text-primary flex shrink-0 items-center gap-1 text-[11px] font-medium tracking-[-0.55px]">
                <Sparkles className="size-3" />
                조건 부합 바이어
              </span>
              <span className="text-primary text-[11px] font-medium tracking-[-0.55px]">-</span>
              <span className="text-primary text-[11px] font-medium tracking-[-0.55px]">{buyer.matchReason}</span>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => onOpenDetail(buyer.id)}
          className="border-primary text-primary hover:bg-primary-50 h-[38px] shrink-0 px-5 text-[13px]"
        >
          상세 보기
        </Button>
      </div>
    </li>
  );
}
