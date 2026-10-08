"use client";

import BuyerListItem from "./BuyerListItem";
import { type BuyerCardView } from "./buyerView";

type BuyerListProps = {
  buyers: BuyerCardView[];
  /** 더 불러올 항목이 남아 있는지 */
  hasMore: boolean;
  /** 다음 페이지를 받는 중 — 버튼을 잠근다(두 번 눌러 같은 페이지를 두 번 받지 않게) */
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onOpenDetail: (buyerId: string) => void;
};

export default function BuyerList({ buyers, hasMore, isLoadingMore, onLoadMore, onOpenDetail }: BuyerListProps) {
  return (
    <div className="bg-white">
      <ul>
        {buyers.map(buyer => (
          <BuyerListItem key={buyer.id} buyer={buyer} onOpenDetail={onOpenDetail} />
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="text-text-tertiary hover:text-text-primary focus-visible:ring-ring w-full py-[18px] text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset disabled:cursor-wait"
        >
          {isLoadingMore ? "불러오는 중…" : "더 보기"}
        </button>
      )}
    </div>
  );
}
