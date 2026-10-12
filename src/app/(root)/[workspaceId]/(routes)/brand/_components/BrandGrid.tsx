"use client";

import BrandCard from "./BrandCard";
import { type BrandCardView } from "./brandView";

/** 카드 그리드 — 시안은 3열(카드 350px). 좁아지면 2열·1열로 줄인다 */
export const BRAND_GRID_CLASS = "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-9";

type BrandGridProps = {
  brands: BrandCardView[];
  hasMore: boolean;
  /** 다음 페이지를 받는 중 — 버튼을 잠근다(두 번 눌러 같은 페이지를 두 번 받지 않게) */
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onOpenDetail: (brandId: string) => void;
};

export default function BrandGrid({ brands, hasMore, isLoadingMore, onLoadMore, onOpenDetail }: BrandGridProps) {
  return (
    <div className="px-6 pt-6">
      <ul className={BRAND_GRID_CLASS}>
        {brands.map(brand => (
          <BrandCard key={brand.id} brand={brand} onOpenDetail={onOpenDetail} />
        ))}
      </ul>

      {hasMore ? (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="text-text-tertiary hover:text-text-primary focus-visible:ring-ring my-2 w-full py-[18px] text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset disabled:cursor-wait"
        >
          {isLoadingMore ? "불러오는 중…" : "더 보기"}
        </button>
      ) : (
        <div className="h-6" />
      )}
    </div>
  );
}
