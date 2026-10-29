import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { IS_MOCK } from "../mock";
import { executeStoreSearch, getStoreSearchDetail, getStoreSearchList } from "./store-search.api";
import { type ExecuteStoreSearchRequest, type StoreSearchListQuery } from "./store-search.type";

export type StoreSearchListFilters = Pick<StoreSearchListQuery, "country" | "city" | "start_date" | "end_date">;

export const storeSearchKeys = {
  all: ["store-search"] as const,
  lists: (workspaceId: string) => [...storeSearchKeys.all, "list", workspaceId] as const,
  list: (workspaceId: string, filters: StoreSearchListFilters) =>
    [...storeSearchKeys.lists(workspaceId), filters] as const,
  detail: (searchId: string) => [...storeSearchKeys.all, "detail", searchId] as const,
};

/** 한 번에 받는 개수 — 서버 기본값. 「더 보기」를 누르면 다음 페이지를 이어 붙인다 */
const STORE_SEARCH_PAGE_SIZE = 20;

/**
 * 탐색 기록 목록 — 페이지를 이어 붙인다(「더 보기」).
 * workspace_uid를 빼면 서버가 내 모든 워크스페이스를 모아 주므로 반드시 보낸다.
 * 필터를 바꿀 때 표가 스켈레톤으로 깜빡이지 않게 새 결과가 올 때까지 이전 결과를 보여준다.
 * TODO(API): 목 데이터가 없어 목 모드에서는 요청하지 않는다
 */
export function useStoreSearchList(workspaceId: string, filters: StoreSearchListFilters) {
  return useInfiniteQuery({
    queryKey: storeSearchKeys.list(workspaceId, filters),
    queryFn: ({ pageParam }) =>
      getStoreSearchList({
        ...filters,
        workspace_uid: Number(workspaceId),
        page: pageParam,
        limit: STORE_SEARCH_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
    placeholderData: keepPreviousData,
    enabled: Boolean(workspaceId) && !IS_MOCK,
  });
}

/** 탐색 실행 — workspaceId(URL)를 workspace_uid로 채워 보낸다. 끝나면 목록을 다시 받는다 */
export function useExecuteStoreSearch(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: (body: Omit<ExecuteStoreSearchRequest, "workspace_uid">) =>
      executeStoreSearch({ ...body, workspace_uid: Number(workspaceId) }),
    onSuccess: () => invalidateQueries.single(storeSearchKeys.lists(workspaceId)),
  });
}

/** 상세 — 응답의 data만 꺼낸다. 404(없는 기록)는 다시 시도해도 같으니 재시도하지 않는다 */
export function useStoreSearchDetail(searchId: string) {
  return useQuery({
    queryKey: storeSearchKeys.detail(searchId),
    queryFn: () => getStoreSearchDetail(searchId),
    select: response => response.data,
    retry: false,
    enabled: Boolean(searchId) && !IS_MOCK,
  });
}
