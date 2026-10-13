"use client";

import { ExternalLink, ImageIcon } from "lucide-react";

import { Sheet, Skeleton } from "@components/ui";

import { type BrandDetailView, type DetailRow } from "./brandView";

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
    <div role="status" aria-label="브랜드 정보를 불러오는 중" className="flex flex-col gap-6">
      <Skeleton className="-mx-3 -mt-3 h-[320px] rounded-none" />
      <div className="flex items-start gap-4 px-2">
        <Skeleton className="size-[60px] shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2 px-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

type BrandDetailSheetProps = {
  detail: BrandDetailView | null;
  isLoading: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * 브랜드 상세 드로어 (피그마 961:11038 · 693:364).
 *
 * 시안의 「우선 연락 추천」·「우리 바이어와 잘 맞는 이유」·「확인이 필요한 조건」·「대표 주소로 메일 보내기」는
 * API가 없어 아직 그리지 않는다(기획 확인 요청). 「해외 진출 실적」은 국가별이 아니라 합계 한 줄로 보여준다.
 */
export default function BrandDetailSheet({ detail, isLoading, isOpen, onOpenChange }: BrandDetailSheetProps) {
  return (
    <Sheet
      side="right"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      // border-l-0 — 시트 왼쪽 1px 테두리가 대표 이미지 옆에서 밝은 여백처럼 보여 없앤다(그림자로 구분된다)
      className="w-full border-l-0 sm:max-w-[560px]"
      header={<h2 className="text-text-primary text-sm font-bold tracking-[-0.7px]">브랜드 상세</h2>}
    >
      {isLoading && <DetailSkeleton />}

      {detail && (
        <div className="flex flex-col gap-6 pb-4">
          {/* 대표 이미지 — 시트 기본 여백(12px)을 상쇄해 폭 전체로 */}
          <div className="bg-secondary-background -mx-3 -mt-3 h-[320px] shrink-0">
            {detail.imageUrl ? (
              <img src={detail.imageUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="text-text-disabled flex size-full items-center justify-center">
                <ImageIcon aria-hidden className="size-10" strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* px-2는 Sheet 기본 패딩 12px에 더해져 좌우 20px가 된다(바이어 상세와 같다) */}
          <div className="flex flex-col gap-6 px-2">
            {/* 요약 — 로고(없으면 이니셜) · 이름 · 링크 · 메타 */}
            <div className="flex items-start gap-4">
              <div className="border-border bg-accent flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-lg border">
                {detail.logoUrl ? (
                  <img src={detail.logoUrl} alt="" className="size-full object-cover" />
                ) : (
                  <span className="text-text-primary text-[28px] leading-none font-bold tracking-[-1.4px]">
                    {detail.initial}
                  </span>
                )}
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
                {detail.meta && (
                  <p className="text-text-tertiary text-sm font-medium tracking-[-0.7px]">{detail.meta}</p>
                )}
              </div>
            </div>

            {detail.shortIntro && (
              <section className="flex flex-col gap-2">
                <SectionTitle>브랜드 소개</SectionTitle>
                <p className="text-text-secondary text-sm font-medium tracking-[-0.7px]">{detail.shortIntro}</p>
              </section>
            )}

            {detail.overseasStoreCount !== null && detail.overseasStoreCount > 0 && (
              <section className="flex flex-col gap-2">
                <SectionTitle>해외 진출 실적</SectionTitle>
                <div className="border-border flex items-center justify-between rounded-xl border px-4 py-3">
                  <span className="text-text-tertiary text-sm font-medium tracking-[-0.7px]">해외 매장</span>
                  <span className="text-text-primary text-sm font-medium tracking-[-0.7px]">
                    {detail.overseasStoreCount.toLocaleString()}개 매장 운영
                  </span>
                </div>
              </section>
            )}

            {detail.targetCountries.length > 0 && (
              <section className="flex flex-col gap-2">
                <SectionTitle>진출 희망 국가</SectionTitle>
                <ul className="flex flex-wrap gap-2">
                  {detail.targetCountries.map(country => (
                    <li
                      key={country}
                      className="bg-secondary-background text-text-primary rounded-md px-2 py-1 text-sm font-medium tracking-[-0.7px]"
                    >
                      {country}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="flex flex-col gap-1">
              <SectionTitle>파트너십 선호 조건</SectionTitle>
              <div className="flex flex-col">
                {detail.partnershipTerms.map(row => (
                  <TermRow key={row.label} row={row} />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-1">
              <SectionTitle>회사 소개</SectionTitle>
              {detail.detailIntro && (
                <p className="text-text-secondary py-2 text-sm leading-relaxed font-medium tracking-[-0.7px]">
                  {detail.detailIntro}
                </p>
              )}
              <div className="flex flex-col">
                {detail.facts.map(row => (
                  <TermRow key={row.label} row={row} />
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </Sheet>
  );
}
