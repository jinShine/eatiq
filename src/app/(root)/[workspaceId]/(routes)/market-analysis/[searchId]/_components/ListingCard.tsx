"use client";

import { useState } from "react";

import { ImageIcon } from "lucide-react";

import { Button } from "@components/ui";

import { cn } from "@utils/shadcn";

import { type StoreListingView } from "../../_components/storeSearchView";

/** 사진 주소가 깨졌거나 없으면 같은 자리에 아이콘을 둔다 — 카드 높이가 흔들리지 않게 */
export function ListingImage({ src, className }: { src: string | undefined; className?: string }) {
  const [isBroken, setIsBroken] = useState(false);

  if (!src || isBroken) {
    return (
      <div className={cn("bg-secondary-background text-text-disabled flex items-center justify-center", className)}>
        <ImageIcon aria-hidden className="size-8" strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setIsBroken(true)}
      className={cn("bg-secondary-background object-cover", className)}
    />
  );
}

type ListingCardProps = {
  listing: StoreListingView;
  onOpenDetail: (listingId: string) => void;
};

/**
 * 매물 카드 (피그마 961:11883).
 * 시안의 2줄 추천 설명·「독점 매물」 배지는 API가 없어 두지 않는다.
 * 이름은 시안의 짧은 이름(「도립대학역」) 대신 서버가 주는 매물 제목이라 길어서 두 줄까지 보여준다.
 */
export default function ListingCard({ listing, onOpenDetail }: ListingCardProps) {
  const spec = [listing.floor, listing.areaPyeong && `전용 ${listing.areaPyeong}`].filter(Boolean).join(" · ");
  const cost = [listing.rent && `월세 ${listing.rent}`, listing.deposit && `보증금 ${listing.deposit}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="border-border flex flex-col overflow-hidden rounded-xl border bg-white">
      <ListingImage src={listing.images[0]} className="h-[200px] w-full" />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 title={listing.title} className="text-text-primary line-clamp-2 text-lg font-bold tracking-[-0.9px]">
          {listing.title}
        </h3>

        <div className="text-text-tertiary flex flex-col gap-1 text-sm font-medium tracking-[-0.7px]">
          {cost && <p>{cost}</p>}
          {spec && <p>{spec}</p>}
          {listing.address && <p className="truncate">{listing.address}</p>}
        </div>

        <Button
          variant="outline"
          onClick={() => onOpenDetail(listing.id)}
          aria-label={`${listing.title} 상세 보기`}
          className="text-text-primary mt-auto h-8 w-full text-[13px] font-medium"
        >
          상세 보기
        </Button>
      </div>
    </article>
  );
}
