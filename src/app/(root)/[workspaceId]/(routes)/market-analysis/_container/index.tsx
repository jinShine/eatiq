"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Toast } from "@components/ui";

import {
  type StoreSearchListFilters,
  useExecuteStoreSearch,
  useStoreSearchList,
} from "@services/api/store-search/store-search.query";

import StartStoreSearchModal from "../_components/StartStoreSearchModal";
import StoreSearchEmptyState from "../_components/StoreSearchEmptyState";
import StoreSearchFilterBar, { EMPTY_FILTERS, type StoreSearchFilters } from "../_components/StoreSearchFilterBar";
import StoreSearchTable from "../_components/StoreSearchTable";
import StoreSearchTableSkeleton from "../_components/StoreSearchTableSkeleton";
import { type toExecuteRequest } from "../_components/storeSearchSchema";
import {
  STORE_SEARCH_DESCRIPTION,
  STORE_SEARCH_TITLE,
  toPeriodRange,
  toStoreSearchRow,
} from "../_components/storeSearchView";

/** 필터 → 목록 API 파라미터. 「전체」(빈 값)는 보내지 않는다 */
const toListFilters = (filters: StoreSearchFilters): StoreSearchListFilters => ({
  country: filters.country || undefined,
  city: filters.city || undefined,
  ...toPeriodRange(filters.period),
});

type MarketAnalysisContainerProps = {
  workspaceId: string;
};

export default function MarketAnalysisContainer({ workspaceId }: MarketAnalysisContainerProps) {
  const router = useRouter();

  const [filters, setFilters] = useState<StoreSearchFilters>(EMPTY_FILTERS);
  const listFilters = toListFilters(filters);
  const isFiltered = Object.values(listFilters).some(Boolean);
  const { data, isLoading, isPlaceholderData, error, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
    useStoreSearchList(workspaceId, listFilters);
  const rows = data?.pages.flatMap(page => page.items.map(toStoreSearchRow)) ?? [];

  const [isStartOpen, setIsStartOpen] = useState(false);
  const { mutate: execute, isPending: isExecuting } = useExecuteStoreSearch(workspaceId);

  const handleReset = () => setFilters(EMPTY_FILTERS);

  const handleExecute = (body: ReturnType<typeof toExecuteRequest>) => {
    execute(body, {
      // 결과는 리포트 화면에서 본다 — 모달은 이동과 함께 사라진다
      onSuccess: response => router.push(`/${workspaceId}/market-analysis/${response.data.uid}`),
      onError: executeError => Toast.error(executeError.message || "탐색을 시작하지 못했어요. 다시 시도해주세요."),
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return <StoreSearchTableSkeleton />;
    }
    if (error) {
      return <StoreSearchEmptyState variant="error" errorMessage={error.message} onRetry={() => refetch()} />;
    }
    if (rows.length === 0) {
      return isFiltered ? (
        <StoreSearchEmptyState variant="no-result" onResetFilters={handleReset} />
      ) : (
        <StoreSearchEmptyState variant="no-data" onStart={() => setIsStartOpen(true)} />
      );
    }
    return (
      <StoreSearchTable
        rows={rows}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        isRefetching={isPlaceholderData}
        onLoadMore={() => fetchNextPage()}
      />
    );
  };

  return (
    <BaseContainerLayout
      header={<PageHeader title={STORE_SEARCH_TITLE} description={STORE_SEARCH_DESCRIPTION} />}
      content={
        <BaseContentLayout>
          {/* 필터가 바뀌면 목록 queryKey가 바뀌어 첫 페이지부터 다시 받는다 */}
          <StoreSearchFilterBar
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
            onStart={() => setIsStartOpen(true)}
          />

          <div className="px-6 py-6">{renderContent()}</div>

          <StartStoreSearchModal
            isOpen={isStartOpen}
            onOpenChange={setIsStartOpen}
            isPending={isExecuting}
            onSubmit={handleExecute}
          />
        </BaseContentLayout>
      }
    />
  );
}
