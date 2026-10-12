"use client";

import { useEffect, useState } from "react";

import { Store } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Button, Toast } from "@components/ui";

import { type BrandListFilters } from "@services/api/brand/brand.query";

import BrandDetailSheet from "../_components/BrandDetailSheet";
import BrandFilterBar, { type BrandFilters, EMPTY_BRAND_FILTERS } from "../_components/BrandFilterBar";
import BrandGrid from "../_components/BrandGrid";
import BrandGridSkeleton from "../_components/BrandGridSkeleton";
import { useBrandDetail } from "../_hooks/useBrandDetail";
import { useBrandList } from "../_hooks/useBrandList";

/** 필터 칩 → 목록 API 파라미터. 「전체」(빈 값)는 보내지 않는다 */
const toListFilters = (filters: BrandFilters): BrandListFilters => ({
  country: filters.country || undefined,
  category: filters.category || undefined,
  contract_type: filters.contractType || undefined,
});

function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="border-border flex flex-col items-center rounded-2xl border border-dashed bg-white px-6 py-20 text-center">
        <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
          <Store className="size-5" strokeWidth={1.5} />
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

/** 브랜드 탐색 — 목록은 워크스페이스와 무관하다(전체 브랜드 탐색) */
export default function BrandContainer() {
  const [filters, setFilters] = useState<BrandFilters>(EMPTY_BRAND_FILTERS);
  const { brands, isLoading, error, hasMore, isLoadingMore, loadMore, retry } = useBrandList(toListFilters(filters));

  // 드로어는 선택된 브랜드 id만 들고 있고, 상세 데이터는 훅이 조회한다
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const { detail, isLoading: isDetailLoading, error: detailError } = useBrandDetail(selectedBrandId);

  // 상세를 못 받으면(삭제된 브랜드 등) 알리고 드로어를 닫는다
  useEffect(() => {
    if (detailError) {
      Toast.error(detailError.message);
      setSelectedBrandId(null);
    }
  }, [detailError]);

  return (
    <BaseContainerLayout
      header={<PageHeader title="브랜드 탐색" description="우리 회사와 잘 맞는 파트너를 찾아보세요" />}
      content={
        <BaseContentLayout>
          {/* 필터가 바뀌면 목록 queryKey가 바뀌어 첫 페이지부터 다시 받는다 */}
          <BrandFilterBar filters={filters} onChange={setFilters} onReset={() => setFilters(EMPTY_BRAND_FILTERS)} />

          {isLoading ? (
            <BrandGridSkeleton />
          ) : error ? (
            <EmptyState
              title="브랜드 목록을 불러오지 못했어요"
              description={error.message}
              action={
                <Button variant="outline" size="sm" onClick={retry}>
                  다시 시도
                </Button>
              }
            />
          ) : brands.length === 0 ? (
            <EmptyState
              title="조건에 맞는 브랜드가 없어요"
              description="필터를 조정하면 더 많은 브랜드를 확인할 수 있어요."
            />
          ) : (
            <BrandGrid
              brands={brands}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={loadMore}
              onOpenDetail={setSelectedBrandId}
            />
          )}

          <BrandDetailSheet
            detail={detail}
            isLoading={isDetailLoading}
            isOpen={selectedBrandId !== null}
            onOpenChange={open => !open && setSelectedBrandId(null)}
          />
        </BaseContentLayout>
      }
    />
  );
}
