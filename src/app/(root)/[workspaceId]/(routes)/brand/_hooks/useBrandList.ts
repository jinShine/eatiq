import { type BrandListFilters, useBrandExploreList } from "@services/api/brand/brand.query";

import { toBrandCard } from "../_components/brandView";

/** 브랜드 탐색 목록 — 받은 페이지를 이어 붙여 카드 뷰모델로 바꾼다. 「더 보기」는 다음 페이지를 받는다 */
export function useBrandList(filters: BrandListFilters) {
  const query = useBrandExploreList(filters);
  const brands = query.data?.pages.flatMap(page => page.items.map(toBrandCard)) ?? [];

  return {
    brands,
    isLoading: query.isLoading,
    error: query.error,
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
    loadMore: () => query.fetchNextPage(),
    retry: () => query.refetch(),
  };
}
