"use client";

import { useState } from "react";

import { ChevronLeft, ChevronRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import { Button, Sheet } from "@components/ui";

import { cn } from "@utils/shadcn";

import { type StoreListingView } from "../../_components/storeSearchView";
import { ListingImage } from "./ListingCard";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-text-primary text-sm font-bold tracking-[-0.7px]">{children}</h3>;
}

/** 기본 임대 정보 칸 — 금액은 아래에 원화 어림값을 함께 둔다(시안 「약 733만원」) */
function LeaseCell({ label, value, note }: { label: string; value: string | null; note?: string | null }) {
  return (
    <div className="border-border flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
      <span className="text-text-tertiary shrink-0 text-xs font-medium">{label}</span>
      <span className="flex flex-col items-end">
        <span className="text-text-primary text-sm font-bold tracking-[-0.7px]">{value ?? "—"}</span>
        {note && <span className="text-text-disabled text-[11px]">{note}</span>}
      </span>
    </div>
  );
}

const linkClassName =
  "text-text-tertiary hover:text-primary focus-visible:ring-ring inline-flex items-center gap-1.5 rounded text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none";

type ListingDetailSheetProps = {
  listing: StoreListingView | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * 매물 상세 드로어 (피그마 961:12069).
 * 시안의 항목별 판단·계약 전 검토 항목·설비 요건 진단·담당자 이름은 API가 없어 두지 않는다.
 * 지도는 좌표가 없어 주소로 구글 지도를 여는 링크로 대신한다.
 */
export default function ListingDetailSheet({ listing, isOpen, onOpenChange }: ListingDetailSheetProps) {
  const [activeImage, setActiveImage] = useState(0);

  const images = listing?.images ?? [];
  const hasContact = Boolean(listing?.tel || listing?.email);
  const move = (step: number) => setActiveImage(index => (index + step + images.length) % images.length);

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
      header={
        <h2 className="text-text-primary line-clamp-1 pr-8 text-sm font-bold tracking-[-0.7px]">
          {listing?.title ?? "매물 상세"}
        </h2>
      }
      footer={
        listing && (
          <div className="flex w-full flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-text-primary text-sm font-bold tracking-[-0.7px]">담당자 연락처</p>
              <p className="text-text-tertiary text-xs font-medium">
                {[listing.tel, listing.email].filter(Boolean).join(" · ") ||
                  "등록된 연락처가 없어요. 출처 페이지에서 확인해주세요."}
              </p>
            </div>

            {hasContact && (
              <div className="flex gap-2">
                {listing.tel && (
                  <Button asChild className="flex-1 gap-1.5">
                    <a href={`tel:${listing.tel}`}>
                      <Phone className="size-4" />
                      전화하기
                    </a>
                  </Button>
                )}
                {listing.email && (
                  <Button asChild variant="outline" className="flex-1 gap-1.5">
                    <a href={`mailto:${listing.email}`}>
                      <Mail className="size-4" />
                      메일 보내기
                    </a>
                  </Button>
                )}
              </div>
            )}

            <p className="text-text-disabled text-[10px] leading-relaxed">
              본 연락처는 매물 등록 사이트에 게시된 정보이며, EATIQ Link가 확인한 정보가 아닙니다.
            </p>
          </div>
        )
      }
    >
      {listing && (
        <div className="flex flex-col gap-6 px-3 py-4">
          {/* 갤러리 */}
          <section className="flex flex-col gap-2" aria-label="매물 사진">
            <div className="relative overflow-hidden rounded-xl">
              {/* key — 사진을 넘기면 깨짐 상태를 새로 판단한다.
                  평면도·지도 이미지가 섞여 있어 잘리지 않게 전체를 보여준다(object-contain) */}
              <ListingImage
                key={images[activeImage]}
                src={images[activeImage]}
                className="h-[280px] w-full object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="이전 사진"
                    onClick={() => move(-1)}
                    className="focus-visible:ring-ring absolute top-1/2 left-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="다음 사진"
                    onClick={() => move(1)}
                    className="focus-visible:ring-ring absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                  <span className="absolute right-3 bottom-3 rounded-full bg-black/50 px-2 py-0.5 text-[11px] text-white tabular-nums">
                    {activeImage + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              // 사진이 많으면 가로로 넘긴다
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    aria-label={`${index + 1}번째 사진 보기`}
                    aria-current={index === activeImage}
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      "focus-visible:ring-ring shrink-0 overflow-hidden rounded-lg border-2 transition-colors focus-visible:ring-2 focus-visible:outline-none",
                      index === activeImage ? "border-primary" : "border-transparent",
                    )}
                  >
                    <ListingImage src={image} className="h-[72px] w-[108px]" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 기본 임대 정보 */}
          <section className="flex flex-col gap-3">
            <SectionTitle>기본 임대 정보</SectionTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <LeaseCell label="월 임대료" value={listing.rent} note={listing.rentKrw} />
              <LeaseCell label="보증금" value={listing.deposit} note={listing.depositKrw} />
              <LeaseCell label="전용 면적" value={listing.areaPyeong} note={listing.areaM2} />
              <LeaseCell label="층" value={listing.floor} />
            </div>
            {(listing.rentKrw || listing.depositKrw) && (
              <p className="text-text-disabled text-[11px]">원화 금액은 탐색할 때의 환율로 계산한 어림값이에요.</p>
            )}
          </section>

          {/* 위치 정보 */}
          <section className="flex flex-col gap-2">
            <SectionTitle>위치 정보</SectionTitle>
            <p className="text-text-tertiary text-sm font-medium tracking-[-0.7px]">{listing.address ?? "—"}</p>
            {listing.originalAddress && <p className="text-text-disabled text-xs">{listing.originalAddress}</p>}
            {listing.mapUrl && (
              <a href={listing.mapUrl} target="_blank" rel="noreferrer noopener" className={linkClassName}>
                <MapPin className="size-3.5" />
                구글 지도에서 보기
                <span className="sr-only">(새 창)</span>
              </a>
            )}
          </section>

          {/* 출처 */}
          {listing.sourceUrl && (
            <section className="flex flex-col gap-2">
              <SectionTitle>출처</SectionTitle>
              <a href={listing.sourceUrl} target="_blank" rel="noreferrer noopener" className={linkClassName}>
                <ExternalLink className="size-3.5" />
                {listing.sourceLabel ?? "매물 원문 보기"}
                <span className="sr-only">(새 창)</span>
              </a>
            </section>
          )}
        </div>
      )}
    </Sheet>
  );
}
