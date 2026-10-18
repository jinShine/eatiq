import { type CrmListFilters, useCrmList } from "@services/api/crm/crm.query";

import { toFilterOptions, toProgressRow } from "../_components/progressView";

/**
 * 진행 관리 목록 — 받은 페이지를 이어 붙여 행 뷰모델로 바꾼다.
 * 필터 선택지도 같은 응답에 실려 오므로 함께 꺼낸다.
 */
export function useProgressList(workspaceId: string, filters: CrmListFilters) {
  const query = useCrmList(workspaceId, filters);
  const firstPage = query.data?.pages[0];

  return {
    rows: query.data?.pages.flatMap(page => page.items.map(toProgressRow)) ?? [],
    total: firstPage?.total ?? 0,
    filterOptions: toFilterOptions(firstPage?.filter_options),
    isLoading: query.isLoading,
    /** 필터를 바꿔 새 결과를 받는 중 — 이전 결과를 흐리게 보여준다 */
    isRefetching: query.isPlaceholderData,
    error: query.error,
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
    loadMore: () => query.fetchNextPage(),
    retry: () => query.refetch(),
  };
}
