"use client";

import { ImageIcon } from "lucide-react";

import { type BrandCardView } from "./brandView";

type BrandCardProps = {
  brand: BrandCardView;
  onOpenDetail: (brandId: string) => void;
};

/** 라벨 + 값 한 줄 — 「대표 메뉴 허니콤보」 */
function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="truncate text-sm font-medium tracking-[-0.7px]">
      <span className="text-text-tertiary">{label}</span>
      <span className="text-text-primary ml-1">{value}</span>
    </p>
  );
}

/**
 * 브랜드 카드 (피그마 961:10846). 서버가 비워 둔 줄은 숨긴다.
 * 시안의 「우선 연락 추천」 배지는 API에 없어 아직 그리지 않는다(기획 확인 요청).
 */
export default function BrandCard({ brand, onOpenDetail }: BrandCardProps) {
  return (
    <li className="border-border flex flex-col overflow-hidden rounded-xl border bg-white">
      {/* 대표 이미지 — 없으면 빈 칸(아이콘) */}
      <div className="bg-secondary-background relative h-[200px] shrink-0">
        {brand.imageUrl ? (
          // 업로드 URL(CloudFront)·외부 URL이 섞여 next/image 최적화 대상이 아니다
          <img src={brand.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="text-text-disabled flex size-full items-center justify-center">
            <ImageIcon aria-hidden className="size-8" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pt-2.5 pb-6">
        {/* 내용이 남은 높이를 채워, 줄이 비어도 버튼은 카드 아래에 붙는다(한 줄의 카드 높이를 맞춘다) */}
        <div className="flex-1">
          <div className="flex min-w-0 items-end gap-2">
            <h3 className="text-text-primary truncate text-lg font-bold tracking-[-0.9px]">{brand.name}</h3>
            {brand.category && (
              <span className="text-text-tertiary shrink-0 text-sm font-medium tracking-[-0.7px]">
                {brand.category}
              </span>
            )}
          </div>
          {brand.intro && (
            <p className="text-text-primary mt-1 line-clamp-1 text-sm font-bold tracking-[-0.7px]">{brand.intro}</p>
          )}

          <div className="mt-4 flex flex-col gap-1">
            {brand.meta && (
              <p className="text-text-tertiary truncate text-sm font-medium tracking-[-0.7px]">{brand.meta}</p>
            )}
            {brand.signatureMenu && <InfoLine label="대표 메뉴" value={brand.signatureMenu} />}
            {brand.contractType && <InfoLine label="선호 계약 방식" value={brand.contractType} />}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetail(brand.id)}
          className="border-border text-text-primary hover:bg-secondary-background focus-visible:ring-ring h-8 w-full rounded-lg border text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none mt-4"
          aria-label={`${brand.name} 상세 보기`}
        >
          상세 보기
        </button>
      </div>
    </li>
  );
}
