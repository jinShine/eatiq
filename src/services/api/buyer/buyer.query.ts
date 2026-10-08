import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { IS_MOCK, mockResolve } from "../mock";
import { getWorkspaceDetail } from "../workspace/workspace.api";
import { mockWorkspaceDetail } from "../workspace/workspace.mock";
import { workspaceKeys } from "../workspace/workspace.query";
import { type WorkspaceDetailResponse } from "../workspace/workspace.type";
import {
  getBuyerCompletion,
  getBuyerDetail,
  getBuyerList,
  updateBuyerBasic,
  updateBuyerContact,
  updateBuyerContractPolicy,
  updateBuyerIntro,
  updateBuyerStatus,
} from "./buyer.api";
import {
  type BuyerCompletion,
  type BuyerCompletionResponse,
  type BuyerCompletionTask,
  type BuyerListQuery,
} from "./buyer.type";

export const buyerKeys = {
  all: ["buyers"] as const,
  list: (filters: BuyerListFilters) => [...buyerKeys.all, "list", filters] as const,
  detail: (buyerId: string) => [...buyerKeys.all, "detail", buyerId] as const,
  completion: (workspaceId: string) => [...buyerKeys.all, "completion", workspaceId] as const,
};

/************************************
 * 바이어 탐색
 ************************************/
export type BuyerListFilters = Pick<BuyerListQuery, "country" | "category" | "contract_type">;

/** 한 번에 받는 개수 — 서버 기본값(최대 50). 「더 보기」를 누르면 다음 페이지를 이어 붙인다 */
const BUYER_PAGE_SIZE = 12;

/**
 * 바이어 탐색 목록 — 페이지를 이어 붙인다(「더 보기」).
 * 필터가 바뀌면 queryKey가 바뀌어 첫 페이지부터 다시 받는다.
 * TODO(API): 목 데이터가 없어 목 모드에서는 요청하지 않는다
 */
export function useBuyerList(filters: BuyerListFilters) {
  return useInfiniteQuery({
    queryKey: buyerKeys.list(filters),
    queryFn: ({ pageParam }) => getBuyerList({ ...filters, page: pageParam, limit: BUYER_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: lastPage => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
    enabled: !IS_MOCK,
  });
}

/** 바이어 상세 — 드로어가 열려 있을 때만(buyerId가 있을 때만) 받는다 */
export function useBuyerDetail(buyerId: string | null) {
  return useQuery({
    queryKey: buyerKeys.detail(buyerId ?? ""),
    queryFn: () => getBuyerDetail(buyerId as string),
    enabled: Boolean(buyerId) && !IS_MOCK,
  });
}

type CompletionTaskDto = NonNullable<BuyerCompletionResponse["next_task"]>;

const toCompletionTask = (task: CompletionTaskDto): BuyerCompletionTask => ({
  title: task.title,
  description: task.description,
  isRequired: task.is_required,
  sectionKey: task.section_key,
  fieldKey: task.field_key,
});

const toCompletion = (response: BuyerCompletionResponse): BuyerCompletion => ({
  rate: response.completion_rate,
  totalFields: response.total_fields,
  completedFields: response.completed_fields,
  step: response.stage.step,
  stepMessage: response.stage.message,
  nextTask: response.next_task ? toCompletionTask(response.next_task) : null,
  remainingTasks: response.remaining_tasks.map(toCompletionTask),
});

/**
 * 바이어 정보 완성 현황 (저니 패널). 브랜드와 달리 탭 없이 한 번에 받는다.
 * TODO(API): 목 데이터가 없어 목 모드에서는 요청하지 않는다
 */
export function useBuyerCompletion(workspaceId: string) {
  return useQuery({
    queryKey: buyerKeys.completion(workspaceId),
    queryFn: () => getBuyerCompletion(workspaceId),
    select: toCompletion,
    enabled: Boolean(workspaceId) && !IS_MOCK,
  });
}

/** 워크스페이스 상세의 바이어 섹션들(buyer_basic … buyer_contact) */
type WorkspaceDetailBuyer = NonNullable<WorkspaceDetailResponse["buyer"]>;
export type BuyerSectionKey = Exclude<Extract<keyof WorkspaceDetailBuyer, `buyer_${string}`>, "buyer_collection">;

/**
 * 섹션의 현재 저장값. 워크스페이스 상세와 같은 queryKey를 써서 요청은 한 번만 나간다 → useBrandSection 주석 참고
 */
export function useBuyerSection<K extends BuyerSectionKey>(workspaceId: string, key: K) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: IS_MOCK ? () => mockResolve(mockWorkspaceDetail) : () => getWorkspaceDetail(workspaceId),
    select: detail => detail.buyer?.[key] ?? null,
    enabled: Boolean(workspaceId),
  });
}

/**
 * 섹션 저장 — 저장이 끝나면 섹션 값(워크스페이스 상세)과 완성도를 다시 받는다.
 * 섹션 값은 다시 받아올 때까지 기다린다 → createBrandSectionMutation 주석 참고
 */
function createBuyerSectionMutation<TBody, TResponse>(save: (workspaceId: string, body: TBody) => Promise<TResponse>) {
  return (workspaceId: string) => {
    const invalidateQueries = useInvalidateQueries();

    return useMutation({
      mutationFn: IS_MOCK
        ? (_body: TBody) => mockResolve<TResponse | undefined>(undefined)
        : (body: TBody): Promise<TResponse | undefined> => save(workspaceId, body),
      onSuccess: () => {
        invalidateQueries.single(buyerKeys.completion(workspaceId));
        return invalidateQueries.single(workspaceKeys.detail(workspaceId));
      },
    });
  };
}

export const useUpdateBuyerBasic = createBuyerSectionMutation(updateBuyerBasic);
export const useUpdateBuyerStatus = createBuyerSectionMutation(updateBuyerStatus);
export const useUpdateBuyerIntro = createBuyerSectionMutation(updateBuyerIntro);
export const useUpdateBuyerContractPolicy = createBuyerSectionMutation(updateBuyerContractPolicy);
export const useUpdateBuyerContact = createBuyerSectionMutation(updateBuyerContact);
