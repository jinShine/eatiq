"use client";

import { useState } from "react";

import { Check, CircleCheck, ExternalLink, MapPin, MessageSquare, Phone } from "lucide-react";

import { Button, Sheet } from "@components/ui";

import { cn } from "@utils/shadcn";

import { FIT_LEVEL_META, type PropertyDetail } from "./analysisDetailMock";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-text-primary text-sm font-bold tracking-[-0.7px]">{children}</h3>;
}

type PropertyDetailSheetProps = {
  detail: PropertyDetail | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContact: (method: "call" | "message") => void;
};

export default function PropertyDetailSheet({ detail, isOpen, onOpenChange, onContact }: PropertyDetailSheetProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <Sheet
      side="right"
      isOpen={isOpen}
      onOpenChange={open => {
        if (!open) {
          setActiveImage(0);
        }
        onOpenChange(open);
      }}
      className="w-full sm:max-w-[600px]"
      header={<h2 className="text-text-primary text-sm font-bold tracking-[-0.7px]">{detail?.name ?? "매물 상세"}</h2>}
      footer={
        detail && (
          <div className="flex w-full flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-text-primary text-sm font-bold tracking-[-0.7px]">담당자 연락처</p>
              <p className="text-text-tertiary text-xs font-medium">
                {detail.contact.name} · {detail.contact.role}
              </p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 gap-1.5" onClick={() => onContact("call")}>
                <Phone className="size-4" />
                전화하기
              </Button>
              <Button variant="outline" className="flex-1 gap-1.5" onClick={() => onContact("message")}>
                <MessageSquare className="size-4" />
                메시지 보내기
              </Button>
            </div>

            <p className="text-text-disabled text-[10px] leading-relaxed">
              본 연락처는 매물 등록 사이트에 게시된 정보이며, EATIQ Link가 확인한 정보가 아닙니다.
            </p>
          </div>
        )
      }
    >
      {detail && (
        <div className="flex flex-col gap-6 px-3 py-4">
          {/* 갤러리 — 사진이 없어 배경색 + 이모지로 대체한다 */}
          <section className="flex flex-col gap-2">
            <div
              className="flex h-[280px] items-center justify-center rounded-xl"
              style={{ backgroundColor: detail.gallery[activeImage]?.background }}
            >
              <span className="text-5xl" aria-hidden>
                {detail.gallery[activeImage]?.emoji}
              </span>
            </div>

            <div className="flex gap-2">
              {detail.gallery.map((image, index) => (
                <button
                  key={`${image.emoji}-${index}`}
                  type="button"
                  aria-label={`${index + 1}번째 사진 보기`}
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "flex h-[84px] flex-1 items-center justify-center rounded-lg border-2 transition-colors",
                    index === activeImage ? "border-primary" : "border-transparent",
                  )}
                  style={{ backgroundColor: image.background }}
                >
                  <span className="text-xl" aria-hidden>
                    {image.emoji}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 기본 임대 정보 */}
          <section className="flex flex-col gap-3">
            <SectionTitle>기본 임대 정보</SectionTitle>
            <div className="border-border grid grid-cols-2 overflow-hidden rounded-xl border">
              {detail.lease.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "border-border flex items-center justify-between gap-3 px-4 py-3",
                    index % 2 === 0 && "border-r",
                    index < detail.lease.length - 2 && "border-b",
                  )}
                >
                  <span className="text-text-tertiary shrink-0 text-xs font-medium">{item.label}</span>
                  <span className="flex flex-col items-end">
                    <span className="text-text-primary text-sm font-bold tracking-[-0.7px]">{item.value}</span>
                    {item.note && <span className="text-text-disabled text-[10px]">{item.note}</span>}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 적합성 판단 */}
          <section className="flex flex-col gap-3">
            <SectionTitle>적합성 판단</SectionTitle>
            <ul className="flex flex-col">
              {detail.fitAssessments.map(item => {
                const meta = FIT_LEVEL_META[item.level];
                return (
                  <li
                    key={item.label}
                    className="border-border flex items-center gap-5 border-b py-2.5 last:border-b-0"
                  >
                    <span className="text-text-primary w-20 shrink-0 text-sm font-medium tracking-[-0.7px]">
                      {item.label}
                    </span>
                    <span className="text-text-primary flex-1 text-sm font-medium tracking-[-0.7px]">{item.value}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-[-0.55px]",
                        meta.className,
                      )}
                    >
                      {meta.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* EATIQ LINK의 발견 */}
          <section className="bg-primary-50 flex flex-col gap-2 rounded-xl p-3">
            <SectionTitle>EATIQ LINK의 발견</SectionTitle>
            <ul className="flex flex-col gap-2">
              {detail.findings.map(finding => (
                <li key={finding.title} className="flex flex-col">
                  <div className="flex items-start gap-1">
                    <CircleCheck className="text-primary mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                    <span className="text-text-primary text-sm font-medium tracking-[-0.7px]">{finding.title}</span>
                  </div>
                  <p className="text-text-tertiary pl-5 text-[11px] font-medium tracking-[-0.55px]">{finding.note}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 계약 전 반드시 검토 필요한 항목 */}
          <section className="flex flex-col gap-3">
            <SectionTitle>계약 전 반드시 검토 필요한 항목</SectionTitle>
            <ul className="flex flex-col gap-2">
              {detail.checkPoints.map(point => (
                <li key={point.title} className="border-border flex flex-col gap-0.5 rounded-xl border px-4 py-3">
                  <span className="text-text-primary text-sm font-bold tracking-[-0.7px]">{point.title}</span>
                  <span className="text-text-tertiary text-[11px] font-medium tracking-[-0.55px]">{point.note}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 위치 정보 */}
          <section className="flex flex-col gap-3">
            <SectionTitle>위치 정보</SectionTitle>
            <p className="text-text-tertiary text-sm font-medium tracking-[-0.7px]">{detail.address}</p>
            {/* TODO(API): 지도 SDK 연결 — 지금은 자리만 잡아둔다 */}
            <div className="bg-accent text-text-disabled flex h-[140px] items-center justify-center gap-1.5 rounded-xl">
              <MapPin className="size-4" />
              <span className="text-xs font-medium">지도는 API 연결 후 표시됩니다</span>
            </div>
          </section>

          {/* 설비 요건 진단 */}
          <section className="flex flex-col gap-3">
            <SectionTitle>설비 요건 진단</SectionTitle>
            <ul className="flex flex-col">
              {detail.facilities.map(item => (
                <li key={item.label} className="border-border flex items-center justify-between gap-4 border-b py-2.5">
                  <span className="text-text-primary text-sm font-medium tracking-[-0.7px]">{item.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-text-primary text-sm font-medium tracking-[-0.7px]">{item.value}</span>
                    <Check className="size-4 shrink-0 text-[#059669]" />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 출처 */}
          <section className="flex flex-col gap-2">
            <SectionTitle>출처</SectionTitle>
            <ul className="flex flex-col gap-1.5">
              {detail.sources.map(source => (
                <li key={source.label}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-text-tertiary hover:text-primary focus-visible:ring-ring inline-flex items-center gap-1.5 rounded text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <ExternalLink className="size-3.5" />
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Sheet>
  );
}
