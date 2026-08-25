"use client";

import { CircleAlert, CircleCheck, ExternalLink, Send } from "lucide-react";

import { Button, Sheet } from "@components/ui";

import { type BuyerDetail, type DetailRow } from "./buyerDetailMock";
import { type BuyerRow } from "./buyerMock";

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

type BuyerDetailSheetProps = {
  buyer: BuyerRow | null;
  detail: BuyerDetail | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSendMail: () => void;
};

export default function BuyerDetailSheet({ buyer, detail, isOpen, onOpenChange, onSendMail }: BuyerDetailSheetProps) {
  return (
    <Sheet
      side="right"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="w-full sm:max-w-[560px]"
      header={<h2 className="text-text-primary text-sm font-bold tracking-[-0.7px]">바이어 상세</h2>}
      footer={
        <Button className="w-full gap-2" onClick={onSendMail} disabled={!buyer}>
          <Send className="size-4" />
          대표 주소로 메일 보내기
        </Button>
      }
    >
      {/* px-3은 Sheet 기본 패딩 12px에 더해져 시안의 좌우 24px가 된다 */}
      {buyer && detail && (
        <div className="flex flex-col gap-6 px-3 py-4">
          {/* 요약 — 목록 행과 같은 아바타·타이틀 구성 */}
          <div className="flex items-start gap-4">
            <div className="border-border bg-accent flex size-[60px] shrink-0 items-center justify-center rounded-lg border">
              <span className="text-text-primary text-[28px] leading-none font-bold tracking-[-1.4px]">
                {buyer.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
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
              <p className="text-text-tertiary text-[11px] font-bold tracking-[-0.55px]">
                운영 브랜드 : {buyer.operatingBrands.join(" · ")}
              </p>
            </div>
          </div>

          {/* 우리 브랜드와 잘 맞는 이유 */}
          <section className="bg-primary-50 flex flex-col gap-2 rounded-xl p-3">
            <SectionTitle>우리 브랜드와 잘 맞는 이유</SectionTitle>
            <ul className="flex flex-col gap-2">
              {detail.matchReasons.map(reason => (
                <li key={reason} className="flex items-center gap-1">
                  <CircleCheck className="text-primary size-4 shrink-0" strokeWidth={1.5} />
                  <span className="text-text-primary text-sm font-medium tracking-[-0.7px]">{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 확인이 필요한 조건 */}
          <section className="bg-warning-50 flex flex-col gap-2 rounded-xl p-3">
            <SectionTitle>확인이 필요한 조건</SectionTitle>
            <ul className="flex flex-col gap-2">
              {detail.checkPoints.map(point => (
                <li key={point.title} className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <CircleAlert className="text-warning size-4 shrink-0" strokeWidth={1.5} />
                    <span className="text-text-primary text-sm font-medium tracking-[-0.7px]">{point.title}</span>
                  </div>
                  <p className="text-text-tertiary pl-5 text-[11px] font-medium tracking-[-0.55px]">
                    - {point.comparison}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* 주요 운영 브랜드 */}
          <section className="flex flex-col gap-3">
            <SectionTitle>주요 운영 브랜드</SectionTitle>
            <ul className="flex flex-col gap-2">
              {detail.operatingBrands.map(brand => (
                <li key={brand.name} className="border-border flex flex-col gap-0.5 rounded-xl border px-4 py-2">
                  <span className="text-text-primary text-sm font-bold tracking-[-0.7px]">{brand.name}</span>
                  <span className="text-text-tertiary text-sm font-medium tracking-[-0.7px]">{brand.meta}</span>
                  <span className="text-text-disabled text-[11px] font-medium tracking-[-0.55px]">{brand.source}</span>
                </li>
              ))}
            </ul>
          </section>

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
            <p className="text-text-secondary py-2 text-sm leading-relaxed font-medium tracking-[-0.7px]">
              {detail.intro}
            </p>
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
