"use client";

import BuyerListItem from "./BuyerListItem";
import { type BuyerRow } from "./buyerMock";

type BuyerListProps = {
  buyers: BuyerRow[];
  /** 더 불러올 항목이 남아 있는지 */
  hasMore: boolean;
  onLoadMore: () => void;
  onOpenDetail: (buyerId: string) => void;
};

export default function BuyerList({ buyers, hasMore, onLoadMore, onOpenDetail }: BuyerListProps) {
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
          className="text-text-tertiary hover:text-text-primary focus-visible:ring-ring w-full py-[18px] text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
        >
          더 보기
        </button>
      )}
    </div>
  );
}
