import { type BuyerListFilters, useBuyerList as useBuyerListQuery } from "@services/api/buyer/buyer.query";

import { toBuyerCard } from "../_components/buyerView";

/**
 * 바이어 탐색 목록 — 받은 페이지를 이어 붙여 카드 뷰모델로 바꾼다.
 * 「더 보기」는 다음 페이지를 받는다(loadMore).
 */
export function useBuyerList(filters: BuyerListFilters) {
  const query = useBuyerListQuery(filters);
  const buyers = query.data?.pages.flatMap(page => page.items.map(toBuyerCard)) ?? [];

  return {
    buyers,
    total: query.data?.pages[0]?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
    loadMore: () => query.fetchNextPage(),
    retry: () => query.refetch(),
  };
}
