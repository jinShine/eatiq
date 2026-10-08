"use client";

import { ExternalLink } from "lucide-react";

import { Sheet, Skeleton } from "@components/ui";

import { type BuyerDetailView, type DetailRow } from "./buyerView";

/** 라벨 - 값 한 줄. 값이 없으면 시안대로 "-"를 보여준다 */
function TermRow({ row }: { row: DetailRow }) {
  return (
    <div className="border-border flex items-start justify-between gap-5 border-b py-2.5">
      <span className="text-text-tertiary shrink-0 text-sm font-medium tracking-[-0.7px]">{row.label}</span>
      <span className="text-text-primary text-right text-sm font-medium tracking-[-0.7px]">{row.value ?? "-"}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-text-primary text-sm font-bold tracking-[-0.7px]">{children}</h3>;
}

function DetailSkeleton() {
  return (
    <div role="status" aria-label="바이어 정보를 불러오는 중" className="flex flex-col gap-6 px-3 py-4">
      <div className="flex items-start gap-4">
        <Skeleton className="size-[60px] shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

type BuyerDetailSheetProps = {
  detail: BuyerDetailView | null;
  isLoading: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * 바이어 상세 드로어 (피그마 961:11467).
 *
 * 브랜드 워크스페이스 시안(693:787)에는 「우리 브랜드와 잘 맞는 이유」·「확인이 필요한 조건」·「대표 주소로 메일 보내기」가
 * 더 있지만 셋 다 API가 없어 아직 그리지 않는다(기획 확인 요청). 바이어 워크스페이스 시안과 같은 구성이다.
 */
export default function BuyerDetailSheet({ detail, isLoading, isOpen, onOpenChange }: BuyerDetailSheetProps) {
  return (
    <Sheet
      side="right"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-full sm:max-w-[560px]"
      header={<h2 className="text-text-primary text-sm font-bold tracking-[-0.7px]">바이어 상세</h2>}
    >
      {isLoading && <DetailSkeleton />}

      {/* px-3은 Sheet 기본 패딩 12px에 더해져 시안의 좌우 24px가 된다 */}
      {detail && (
        <div className="flex flex-col gap-6 px-3 py-4">
          {/* 요약 — 목록 행과 같은 아바타·타이틀 구성 */}
          <div className="flex items-start gap-4">
            <div className="border-border bg-accent flex size-[60px] shrink-0 items-center justify-center rounded-lg border">
              <span className="text-text-primary text-[28px] leading-none font-bold tracking-[-1.4px]">
                {detail.initial}
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-text-primary truncate text-lg font-bold tracking-[-0.9px]">{detail.name}</h3>
                {detail.websiteUrl && (
                  <a
                    href={detail.websiteUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${detail.name} 웹사이트 열기`}
                    className="text-text-disabled hover:text-primary focus-visible:ring-ring shrink-0 rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
              {detail.brandSummary && (
                <p className="text-text-tertiary text-[11px] font-bold tracking-[-0.55px]">{detail.brandSummary}</p>
              )}
            </div>
          </div>

          {/* 주요 운영 브랜드 — 없으면 섹션째 숨긴다 */}
          {detail.operatingBrands.length > 0 && (
            <section className="flex flex-col gap-3">
              <SectionTitle>주요 운영 브랜드</SectionTitle>
              <ul className="flex flex-col gap-2">
                {detail.operatingBrands.map(brand => (
                  <li key={brand.name} className="border-border flex flex-col gap-0.5 rounded-xl border px-4 py-2">
                    <span className="text-text-primary text-sm font-bold tracking-[-0.7px]">{brand.name}</span>
                    {brand.meta && (
                      <span className="text-text-tertiary text-sm font-medium tracking-[-0.7px]">{brand.meta}</span>
                    )}
                    {brand.source && (
                      <span className="text-text-disabled text-[11px] font-medium tracking-[-0.55px]">
                        {brand.source}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 파트너십 선호 조건 */}
          <section className="flex flex-col gap-1">
            <SectionTitle>파트너십 선호 조건</SectionTitle>
            <div className="flex flex-col">
              {detail.partnershipTerms.map(row => (
                <TermRow key={row.label} row={row} />
              ))}
            </div>
          </section>

          {/* 회사 소개 */}
          <section className="flex flex-col gap-1">
            <SectionTitle>회사 소개</SectionTitle>
            {detail.intro && (
              <p className="text-text-secondary py-2 text-sm leading-relaxed font-medium tracking-[-0.7px]">
                {detail.intro}
              </p>
            )}
            <div className="flex flex-col">
              {detail.companyFacts.map(row => (
                <TermRow key={row.label} row={row} />
              ))}
            </div>
          </section>
        </div>
      )}
    </Sheet>
  );
}
