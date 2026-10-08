import { useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { IS_MOCK, mockResolve } from "../mock";
import { getWorkspaceDetail } from "../workspace/workspace.api";
import { mockWorkspaceDetail } from "../workspace/workspace.mock";
import { workspaceKeys } from "../workspace/workspace.query";
import { type WorkspaceDetailResponse } from "../workspace/workspace.type";
import {
  updateBuyerBasic,
  updateBuyerContact,
  updateBuyerContractPolicy,
  updateBuyerIntro,
  updateBuyerStatus,
} from "./buyer.api";

export const buyerKeys = {
  all: ["buyers"] as const,
  completion: (workspaceId: string) => [...buyerKeys.all, "completion", workspaceId] as const,
};

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
