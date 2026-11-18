"use client";

import { useState } from "react";

import { ExternalLink, ImageIcon } from "lucide-react";

import { ImagePreviewModal, Sheet, Skeleton } from "@components/ui";

import { type BrandDetailView } from "./brandView";
import { ExternalLinks, KpiCard, MenuCard, SectionTitle, TermRow, YearBarChart } from "./detail/DetailParts";

function DetailSkeleton() {
  return (
    <div role="status" aria-label="브랜드 정보를 불러오는 중" className="flex flex-col gap-6">
      <Skeleton className="-mx-3 -mt-3 aspect-[7/4] rounded-none" />
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
 * 브랜드 상세 드로어 v2 (피그마 2072:4921 「Drawer_브랜드상세_풀스펙_v2」).
 *
 * 대표 사진 → 머리 → 브랜드 소개 → 대표 메뉴 → 매장 · 인테리어 → 연평균 매출 추이 → 가맹점 수 추이 →
 * 진출 희망 국가 → 파트너십 선호 조건 → 외부 링크 → 정보 출처.
 * 데이터가 없는 섹션은 통째로 뺀다. 시안의 「파트너 역할」·「본사 정보」·「대표 주소로 메일 보내기」는 API가 없어 그리지 않는다.
 * 시안에서 숨겨 둔(투명) 「전년 대비」·「3년 새」·「증가 추세」 문구도 그리지 않는다
 */
export default function BrandDetailSheet({ detail, isLoading, isOpen, onOpenChange }: BrandDetailSheetProps) {
  const [storePreviewIndex, setStorePreviewIndex] = useState<number | null>(null);

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
          {/* 대표 사진 — 시안 700:400 비율. 시트 기본 여백(12px)을 상쇄해 폭 전체로.
              사진을 겹쳐 넣고(absolute) 넘치는 곳을 잘라야 비율이 고정된다 — 그냥 넣으면 세로가 긴 사진이 상자를 늘린다 */}
          <div className="bg-secondary-background relative -mx-3 -mt-3 aspect-[7/4] shrink-0 overflow-hidden">
            {detail.imageUrl ? (
              <img src={detail.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
            ) : (
              <div className="text-text-disabled flex size-full items-center justify-center">
                <ImageIcon aria-hidden className="size-10" strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* px-2는 Sheet 기본 패딩 12px에 더해져 좌우 20px가 된다(바이어 상세와 같다) */}
          <div className="flex flex-col gap-6 px-2">
            {/* 머리 — 로고(없으면 이니셜) · 이름 · 링크 · 메타 */}
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
              <section className="flex flex-col gap-2.5">
                <SectionTitle>브랜드 소개</SectionTitle>
                <p className="text-text-tertiary text-sm font-medium tracking-[-0.7px]">{detail.shortIntro}</p>
              </section>
            )}

            {detail.menus.length > 0 && (
              <section className="flex flex-col gap-2.5">
                <SectionTitle>대표 메뉴</SectionTitle>
                <ul className="flex flex-col gap-3">
                  {detail.menus.map(menu => (
                    <MenuCard key={menu.key} menu={menu} />
                  ))}
                </ul>
              </section>
            )}

            {detail.storeImages.length > 0 && (
              <section className="flex flex-col gap-2.5">
                <SectionTitle>매장 · 인테리어</SectionTitle>
                {/* 시안은 300×200 사진을 가로로 잇는다 — 넘치면 옆으로 넘겨 본다. 누르면 크게 보기 */}
                <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                  {detail.storeImages.map((url, index) => (
                    <li key={url} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setStorePreviewIndex(index)}
                        aria-label={`매장 사진 ${index + 1} 크게 보기`}
                        className="bg-accent focus-visible:ring-ring block h-[200px] w-[300px] cursor-pointer overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <img
                          src={url}
                          alt=""
                          className="size-full object-cover transition-transform hover:scale-[1.02]"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {detail.sales && (
              <section className="flex flex-col gap-2.5">
                <SectionTitle aside={`가맹점 평균 · ${detail.sales.latestYear}년 실적`}>연평균 매출 추이</SectionTitle>
                <div className="flex gap-2">
                  {/* 시안은 월평균이지만 기획 변경(11-18)으로 매출은 모두 연 기준이다 */}
                  {detail.sales.annualSalesText && (
                    <KpiCard label="가맹점 연평균 매출" value={detail.sales.annualSalesText} />
                  )}
                  {detail.sales.salesPerAreaText && (
                    <KpiCard label="3.3㎡당 연 매출" value={detail.sales.salesPerAreaText} caption="가맹점 평균" />
                  )}
                </div>
                {detail.sales.bars.some(bar => bar.value !== null) && (
                  <div className="border-border flex flex-col gap-3 rounded-xl border bg-white p-4">
                    <YearBarChart bars={detail.sales.bars} label="연도별 가맹점 연평균 매출" />
                    <p className="text-text-disabled text-[11px] tracking-[-0.55px]">
                      가맹점 한 곳의 연평균 매출{detail.infoSource ? ` · ${detail.infoSource}` : ""}
                    </p>
                  </div>
                )}
              </section>
            )}

            {detail.franchise && (
              <section className="flex flex-col gap-2.5">
                <SectionTitle>가맹점 수 추이</SectionTitle>
                <div className="flex gap-2">
                  {detail.franchise.franchiseCount !== null && (
                    <KpiCard label="가맹점" value={`${detail.franchise.franchiseCount.toLocaleString()}개`} />
                  )}
                  {detail.franchise.directCount !== null && (
                    <KpiCard label="직영점" value={`${detail.franchise.directCount.toLocaleString()}개`} />
                  )}
                </div>
                {detail.franchise.bars.some(bar => bar.value !== null) && (
                  <div className="border-border rounded-xl border bg-white p-4">
                    <YearBarChart bars={detail.franchise.bars} label="연도별 가맹점 수" />
                  </div>
                )}
                {detail.franchise.contract && (
                  <dl className="bg-accent flex items-center justify-between rounded-xl px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <dt className="text-text-primary text-sm font-bold tracking-[-0.7px]">계약 현황</dt>
                      <dd className="text-text-tertiary text-xs tracking-[-0.6px]">
                        {detail.franchise.contract.year}년
                      </dd>
                    </div>
                    {(
                      [
                        ["신규 개점", detail.franchise.contract.newOpen],
                        ["계약 종료", detail.franchise.contract.contractEnd],
                        ["계약 해지", detail.franchise.contract.contractCancel],
                      ] as const
                    ).map(([label, count]) => (
                      <div key={label} className="flex flex-col-reverse items-center gap-0.5">
                        <dt className="text-text-tertiary text-xs font-medium tracking-[-0.6px]">{label}</dt>
                        <dd className="text-text-primary text-base font-bold tracking-[-0.8px]">
                          {count.toLocaleString()}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
                {detail.infoSource && (
                  <p className="text-text-disabled text-[11px] tracking-[-0.55px]">출처: {detail.infoSource}</p>
                )}
              </section>
            )}

            {detail.targetCountries.length > 0 && (
              <section className="flex flex-col gap-2.5">
                <SectionTitle>진출 희망 국가</SectionTitle>
                <ul className="flex flex-wrap gap-2">
                  {detail.targetCountries.map(country => (
                    <li
                      key={country}
                      className="border-border bg-accent text-text-tertiary rounded-full border px-2 py-1 text-sm font-medium tracking-[-0.7px]"
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

            {detail.links.length > 0 && (
              <section className="flex flex-col gap-3">
                <SectionTitle>외부 링크</SectionTitle>
                <ExternalLinks links={detail.links} />
              </section>
            )}

            {(detail.checkedDate || detail.infoSource) && (
              <section className="flex flex-col gap-2.5">
                <SectionTitle>정보 출처</SectionTitle>
                <div className="bg-accent flex flex-col gap-1.5 rounded-lg p-3">
                  {detail.checkedDate && (
                    <p className="text-text-tertiary text-xs tracking-[-0.6px]">정보 확인 {detail.checkedDate}</p>
                  )}
                  {detail.infoSource && (
                    <p className="text-text-tertiary text-xs tracking-[-0.6px]">{detail.infoSource}</p>
                  )}
                </div>
              </section>
            )}
          </div>

          <ImagePreviewModal
            images={detail.storeImages.map((src, index) => ({ src, alt: `매장 사진 ${index + 1}` }))}
            initialIndex={storePreviewIndex ?? 0}
            isOpen={storePreviewIndex !== null}
            onClose={() => setStorePreviewIndex(null)}
          />
        </div>
      )}
    </Sheet>
  );
}
