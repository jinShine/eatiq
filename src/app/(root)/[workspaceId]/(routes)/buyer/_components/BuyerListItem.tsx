"use client";

import { ExternalLink } from "lucide-react";

import { Button } from "@components/ui";

import { type BuyerCardView } from "./buyerView";

type BuyerListItemProps = {
  buyer: BuyerCardView;
  onOpenDetail: (buyerId: string) => void;
};

/**
 * 바이어 카드 (피그마 961:11236). 서버가 비워 둔 줄은 숨긴다.
 * 시안의 「조건 부합 바이어」 표시는 API에 없어 아직 그리지 않는다(기획 확인 요청).
 */
export default function BuyerListItem({ buyer, onOpenDetail }: BuyerListItemProps) {
  return (
    <li className="border-border border-b bg-white px-7 py-[18px]">
      <div className="flex items-start gap-4">
        {/* 이니셜 아바타 */}
        <div className="border-border bg-accent flex size-[60px] shrink-0 items-center justify-center rounded-lg border">
          <span className="text-text-primary text-[28px] leading-none font-bold tracking-[-1.4px]">
            {buyer.initial}
          </span>
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

          {buyer.summary && <p className="text-text-tertiary text-sm font-medium tracking-[-0.7px]">{buyer.summary}</p>}

          {buyer.brandSummary && (
            <p className="text-text-tertiary text-[11px] font-bold tracking-[-0.55px]">{buyer.brandSummary}</p>
          )}

          {(buyer.meta || buyer.hasKoreanBrandExperience) && (
            <p className="text-text-disabled text-[11px] font-medium tracking-[-0.55px]">
              {buyer.meta}
              {buyer.hasKoreanBrandExperience && (
                <span className="text-success">{buyer.meta ? " · " : ""}한국 브랜드 경험</span>
              )}
            </p>
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
