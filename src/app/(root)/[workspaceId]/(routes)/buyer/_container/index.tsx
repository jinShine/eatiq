"use client";

import { useEffect, useState } from "react";

import { Users } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Button, Toast } from "@components/ui";

import { type BuyerListFilters } from "@services/api/buyer/buyer.query";

import BuyerDetailSheet from "../_components/BuyerDetailSheet";
import BuyerFilterBar, { type BuyerFilters, EMPTY_BUYER_FILTERS } from "../_components/BuyerFilterBar";
import BuyerList from "../_components/BuyerList";
import BuyerListSkeleton from "../_components/BuyerListSkeleton";
import { useBuyerDetail } from "../_hooks/useBuyerDetail";
import { useBuyerList } from "../_hooks/useBuyerList";

/** 필터 칩 → 목록 API 파라미터. 「전체」(빈 값)는 보내지 않는다 */
const toListFilters = (filters: BuyerFilters): BuyerListFilters => ({
  country: filters.country || undefined,
  category: filters.category || undefined,
  contract_type: filters.contractType || undefined,
});

function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="border-border flex flex-col items-center rounded-2xl border border-dashed bg-white px-6 py-20 text-center">
        <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
          <Users className="size-5" strokeWidth={1.5} />
        </div>
        <p className="text-text-primary mt-5 text-sm font-semibold">{title}</p>
        <p className="text-text-tertiary mt-1.5 max-w-[38ch] text-xs leading-relaxed whitespace-pre-line">
          {description}
        </p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}

type BuyerContainerProps = {
  workspaceId: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 목록은 워크스페이스와 무관하다(전체 바이어 탐색)
export default function BuyerContainer({ workspaceId }: BuyerContainerProps) {
  const [filters, setFilters] = useState<BuyerFilters>(EMPTY_BUYER_FILTERS);
  const { buyers, isLoading, error, hasMore, isLoadingMore, loadMore, retry } = useBuyerList(toListFilters(filters));

  // 드로어는 선택된 바이어 id만 들고 있고, 상세 데이터는 훅이 조회한다
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
  const { detail, isLoading: isDetailLoading, error: detailError } = useBuyerDetail(selectedBuyerId);

  // 상세를 못 받으면(삭제된 바이어 등) 알리고 드로어를 닫는다 — 스펙의 404 처리 안내
  useEffect(() => {
    if (detailError) {
      Toast.error(detailError.message);
      setSelectedBuyerId(null);
    }
  }, [detailError]);

  return (
    <BaseContainerLayout
      header={<PageHeader title="바이어 탐색" description="해외 진출을 함께할 파트너를 찾아보세요" />}
      content={
        <BaseContentLayout>
          {/* 필터가 바뀌면 목록 queryKey가 바뀌어 첫 페이지부터 다시 받는다 */}
          <BuyerFilterBar filters={filters} onChange={setFilters} onReset={() => setFilters(EMPTY_BUYER_FILTERS)} />

          {isLoading ? (
            <BuyerListSkeleton />
          ) : error ? (
            <EmptyState
              title="바이어 목록을 불러오지 못했어요"
              description={error.message}
              action={
                <Button variant="outline" size="sm" onClick={retry}>
                  다시 시도
                </Button>
              }
            />
          ) : buyers.length === 0 ? (
            <EmptyState
              title="조건에 맞는 바이어가 없어요"
              description="필터를 조정하면 더 많은 파트너를 확인할 수 있어요."
            />
          ) : (
            <BuyerList
              buyers={buyers}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={loadMore}
              onOpenDetail={setSelectedBuyerId}
            />
          )}

          <BuyerDetailSheet
            detail={detail}
            isLoading={isDetailLoading}
            isOpen={selectedBuyerId !== null}
            onOpenChange={open => !open && setSelectedBuyerId(null)}
          />
        </BaseContentLayout>
      }
    />
  );
}
