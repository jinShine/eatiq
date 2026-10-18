import { keepPreviousData, useInfiniteQuery, useMutation } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { IS_MOCK } from "../mock";
import { createCrm, deleteCrm, getCrmList } from "./crm.api";
import { type CreateCrmRequest, type CrmListQuery } from "./crm.type";

export type CrmListFilters = Pick<CrmListQuery, "keyword" | "country" | "category" | "contract_type">;

export const crmKeys = {
  all: ["crm"] as const,
  lists: (workspaceId: string) => [...crmKeys.all, "list", workspaceId] as const,
  list: (workspaceId: string, filters: CrmListFilters) => [...crmKeys.lists(workspaceId), filters] as const,
};

/** 한 번에 받는 개수 — 서버 기본값. 「더 보기」를 누르면 다음 페이지를 이어 붙인다 */
const CRM_PAGE_SIZE = 20;

/**
 * 진행 관리 목록 — 페이지를 이어 붙인다(「더 보기」).
 * workspaceId(URL)는 워크스페이스 uid라 그대로 workspace_uid로 보낸다.
 * 검색어를 칠 때마다 표가 스켈레톤으로 깜빡이지 않게 새 결과가 올 때까지 이전 결과를 보여준다.
 * TODO(API): 목 데이터가 없어 목 모드에서는 요청하지 않는다
 */
export function useCrmList(workspaceId: string, filters: CrmListFilters) {
  return useInfiniteQuery({
    queryKey: crmKeys.list(workspaceId, filters),
    queryFn: ({ pageParam }) =>
      getCrmList({ ...filters, workspace_uid: Number(workspaceId), page: pageParam, limit: CRM_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: lastPage => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
    placeholderData: keepPreviousData,
    enabled: Boolean(workspaceId) && !IS_MOCK,
  });
}

/**
 * 관리 대상 추가 — workspaceId(URL)를 source_workspace_uid로 채워 보낸다.
 * 끝나면 목록을 다시 받는다. 모달은 다시 받아올 때까지 기다렸다 닫는다(닫히자마자 새 행이 보이게)
 */
export function useCreateCrm(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: (body: Omit<CreateCrmRequest, "source_workspace_uid">) =>
      createCrm({ ...body, source_workspace_uid: Number(workspaceId) }),
    onSuccess: () => invalidateQueries.single(crmKeys.lists(workspaceId)),
  });
}

/** 관리 대상 삭제 — 끝나면 이 워크스페이스의 목록(모든 필터 조합)을 다시 받는다 */
export function useDeleteCrm(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: (crmId: string) => deleteCrm(crmId),
    onSuccess: () => invalidateQueries.single(crmKeys.lists(workspaceId)),
  });
}
