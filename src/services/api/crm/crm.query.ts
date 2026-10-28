import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { getBrandAutocomplete } from "../brand/brand.api";
import { brandKeys } from "../brand/brand.query";
import { getBuyerAutocomplete } from "../buyer/buyer.api";
import { buyerKeys } from "../buyer/buyer.query";
import { IS_MOCK } from "../mock";
import {
  createCrm,
  createCrmAction,
  deleteCrm,
  deleteCrmAction,
  getCrmDetail,
  getCrmList,
  updateCrmAction,
  updateCrmNextActionDone,
  updateCrmStage,
} from "./crm.api";
import {
  type CreateCrmActionRequest,
  type CreateCrmRequest,
  type CrmDetailResponse,
  type CrmListQuery,
  type CrmStage,
  type UpdateCrmActionRequest,
} from "./crm.type";

/** 관리 대상의 유형 — 브랜드 워크스페이스는 바이어를, 바이어 워크스페이스는 브랜드를 관리한다 */
export type CrmPartnerType = "buyer" | "brand";

/** 자동완성은 2글자부터 — 1글자는 서버가 400을 준다 */
export const PARTNER_SEARCH_MIN_LENGTH = 2;

export type CrmListFilters = Pick<CrmListQuery, "keyword" | "country" | "category" | "contract_type">;

export const crmKeys = {
  all: ["crm"] as const,
  lists: (workspaceId: string) => [...crmKeys.all, "list", workspaceId] as const,
  list: (workspaceId: string, filters: CrmListFilters) => [...crmKeys.lists(workspaceId), filters] as const,
  /** lists 아래에 둔다 — 추가·삭제가 lists를 무효화하면 함께 다시 받는다 */
  managedPartnerIds: (workspaceId: string) => [...crmKeys.lists(workspaceId), "managed-partner-ids"] as const,
  detail: (crmId: string) => [...crmKeys.all, "detail", crmId] as const,
  partnerSearch: (partnerType: CrmPartnerType, keyword: string) =>
    [...crmKeys.all, "partner-search", partnerType, keyword] as const,
};

/**
 * 진행 관리 데이터를 요약해 보여주는 대시보드(단계 건수·다음 액션·최근 활동).
 * 진행 관리에서 무엇이든 바뀌면 함께 다시 받는다 — 안 그러면 캐시 유효 시간(1분) 동안 옛 숫자가 보인다.
 * 워크스페이스 유형을 몰라도 되도록 브랜드·바이어 키를 모두 넘긴다(없는 쪽은 아무 일도 없다)
 */
const dashboardKeys = (workspaceId: string) => [brandKeys.dashboard(workspaceId), buyerKeys.dashboard(workspaceId)];

/** 한 번에 받는 개수 — 서버 기본값. 「더 보기」를 누르면 다음 페이지를 이어 붙인다 */
const CRM_PAGE_SIZE = 20;

/** 서버가 허용하는 한 페이지 최대 개수 */
const CRM_MAX_PAGE_SIZE = 100;

/**
 * 이미 관리 중인 상대의 워크스페이스 uid — 추가 모달의 검색 결과에 「관리 중」을 표시한다.
 * 검색(자동완성) 응답에 등록 여부가 없고, 목록 화면의 쿼리는 필터·페이지 단위라 쓸 수 없어 필터 없이 따로 모은다.
 * 직접 입력한 상대(target_workspace_uid 없음)는 검색 결과와 겹치지 않아 뺀다.
 */
export function useManagedPartnerIds(workspaceId: string, enabled: boolean) {
  return useQuery({
    queryKey: crmKeys.managedPartnerIds(workspaceId),
    queryFn: async () => {
      const fetchPage = (page: number) =>
        getCrmList({ workspace_uid: Number(workspaceId), page, limit: CRM_MAX_PAGE_SIZE });
      // 첫 페이지로 전체 페이지 수를 알고, 나머지는 한꺼번에 받는다(보통 한 페이지로 끝난다)
      const first = await fetchPage(1);
      const rest = await Promise.all(
        Array.from({ length: Math.max(first.total_pages - 1, 0) }, (_, index) => fetchPage(index + 2)),
      );
      const ids = new Set<number>();
      [first, ...rest].forEach(res =>
        res.items.forEach(item => {
          if (item.target_workspace_uid != null) {
            ids.add(item.target_workspace_uid);
          }
        }),
      );
      return ids;
    },
    enabled: enabled && Boolean(workspaceId) && !IS_MOCK,
  });
}

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
    onSuccess: () => invalidateQueries.multiple([crmKeys.lists(workspaceId), ...dashboardKeys(workspaceId)]),
  });
}

/** 관리 대상 삭제 — 끝나면 이 워크스페이스의 목록(모든 필터 조합)을 다시 받는다 */
export function useDeleteCrm(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: (crmId: string) => deleteCrm(crmId),
    onSuccess: () => invalidateQueries.multiple([crmKeys.lists(workspaceId), ...dashboardKeys(workspaceId)]),
  });
}

/************************************
 * 상세
 ************************************/

/** 상세 — 응답의 data만 꺼낸다. 404(삭제됨)는 다시 시도해도 같으니 재시도하지 않는다 */
export function useCrmDetail(crmId: string) {
  return useQuery({
    queryKey: crmKeys.detail(crmId),
    queryFn: () => getCrmDetail(crmId),
    select: response => response.data,
    retry: false,
    enabled: Boolean(crmId) && !IS_MOCK,
  });
}

/**
 * 상세 화면의 변경 — 상세와 목록(현재 단계·다음 액션 열)을 함께 다시 받는다.
 * 상세는 다시 받아올 때까지 기다린다(화면이 서버 값으로 맞춰진 뒤 pending이 풀리게)
 */
function useInvalidateCrm(workspaceId: string, crmId: string) {
  const invalidateQueries = useInvalidateQueries();

  return () => {
    invalidateQueries.multiple([crmKeys.lists(workspaceId), ...dashboardKeys(workspaceId)]);
    return invalidateQueries.single(crmKeys.detail(crmId));
  };
}

/** 상세 캐시를 바로 고쳐 쓰는 낙관적 업데이트 — 실패하면 이전 값으로 되돌린다 */
function useOptimisticDetail(crmId: string) {
  const queryClient = useQueryClient();
  const queryKey = crmKeys.detail(crmId);

  return {
    apply: async (update: (data: CrmDetailResponse["data"]) => CrmDetailResponse["data"]) => {
      // 진행 중인 재조회가 낙관적 값을 덮어쓰지 않게 멈춘다
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<CrmDetailResponse>(queryKey);
      if (previous) {
        queryClient.setQueryData<CrmDetailResponse>(queryKey, { ...previous, data: update(previous.data) });
      }
      return { previous };
    },
    rollback: (previous: CrmDetailResponse | undefined) => {
      if (previous) {
        queryClient.setQueryData(queryKey, previous);
      }
    },
  };
}

/** 현재 단계 변경 — 선택 박스가 바로 바뀌도록 낙관적으로 반영한다 */
export function useUpdateCrmStage(workspaceId: string, crmId: string) {
  const invalidate = useInvalidateCrm(workspaceId, crmId);
  const optimistic = useOptimisticDetail(crmId);

  return useMutation({
    mutationFn: (stage: CrmStage) => updateCrmStage(crmId, stage),
    onMutate: stage => optimistic.apply(data => ({ ...data, current_stage: stage })),
    onError: (_error, _stage, context) => optimistic.rollback(context?.previous),
    onSettled: invalidate,
  });
}

/** 다음 액션 완료 — 스위치가 바로 바뀌도록 낙관적으로 반영한다(진행 기록 안의 idx번 액션) */
export function useUpdateCrmNextActionDone(workspaceId: string, crmId: string) {
  const invalidate = useInvalidateCrm(workspaceId, crmId);
  const optimistic = useOptimisticDetail(crmId);

  return useMutation({
    mutationFn: ({ actionId, idx, isDone }: { actionId: string; idx: number; isDone: boolean }) =>
      updateCrmNextActionDone(actionId, idx, isDone),
    // 기록 안의 그 액션만 바꾼다. 요약(next_actions)은 서버가 다시 계산해 주므로 재조회를 기다린다
    onMutate: ({ actionId, idx, isDone }) =>
      optimistic.apply(data => ({
        ...data,
        actions: data.actions.map(action =>
          String(action.uid) === actionId
            ? {
                ...action,
                next_actions: action.next_actions?.map(item =>
                  item.idx === idx ? { ...item, is_done: isDone ? "Y" : "N" } : item,
                ),
              }
            : action,
        ),
      })),
    onError: (_error, _variables, context) => optimistic.rollback(context?.previous),
    onSettled: invalidate,
  });
}

/** 진행 기록 등록 — crm_uid는 상세 화면의 대상으로 채운다. 드로어는 다시 받아올 때까지 기다렸다 닫는다 */
export function useCreateCrmAction(workspaceId: string, crmId: string) {
  const invalidate = useInvalidateCrm(workspaceId, crmId);

  return useMutation({
    mutationFn: (body: Omit<CreateCrmActionRequest, "crm_uid">) => createCrmAction({ ...body, crm_uid: Number(crmId) }),
    onSuccess: invalidate,
  });
}

/** 진행 기록 수정 */
export function useUpdateCrmAction(workspaceId: string, crmId: string) {
  const invalidate = useInvalidateCrm(workspaceId, crmId);

  return useMutation({
    mutationFn: ({ actionId, body }: { actionId: string; body: UpdateCrmActionRequest }) =>
      updateCrmAction(actionId, body),
    onSuccess: invalidate,
  });
}

/** 진행 기록 삭제 */
export function useDeleteCrmAction(workspaceId: string, crmId: string) {
  const invalidate = useInvalidateCrm(workspaceId, crmId);

  return useMutation({
    mutationFn: (actionId: string) => deleteCrmAction(actionId),
    onSuccess: invalidate,
  });
}

/**
 * 「검색해서 추가」의 상대 검색 — 상대 유형에 맞는 자동완성을 부른다.
 * 글자를 더 칠 때 목록이 비었다 다시 차지 않도록 새 결과가 올 때까지 이전 결과를 보여준다.
 */
export function useCrmPartnerSearch(partnerType: CrmPartnerType, keyword: string) {
  return useQuery({
    queryKey: crmKeys.partnerSearch(partnerType, keyword),
    queryFn: () => (partnerType === "buyer" ? getBuyerAutocomplete(keyword) : getBrandAutocomplete(keyword)),
    enabled: keyword.length >= PARTNER_SEARCH_MIN_LENGTH && !IS_MOCK,
    placeholderData: keepPreviousData,
  });
}
