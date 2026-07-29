import { useMutation, useQuery } from "@tanstack/react-query";

import { useInvalidateQueries } from "@hooks/commons";

import { getBrandSettings, getBrands, updateBrandBasic } from "./brand.api";
import { type UpdateBasicRequest } from "./brand.type";

export type Workspace = {
  id: string;
  name: string;
};

// brand(API) → workspace(뷰모델) 매핑. id/nameKo만 가진 형태면 모두 수용
const toWorkspace = (b: { id?: string; nameKo?: string }): Workspace => ({
  id: b.id ?? "",
  name: b.nameKo ?? "",
});

export const brandKeys = {
  all: ["brands"] as const,
  list: () => [...brandKeys.all, "list"] as const,
  current: () => [...brandKeys.all, "current"] as const,

  settings: (workspaceId: string) => [...brandKeys.all, "settings", workspaceId] as const,
};

export function useWorkspaces() {
  return useQuery({
    queryKey: brandKeys.list(),
    queryFn: getBrands,
    select: page => (page.content ?? []).map(toWorkspace),
  });
}

/************************************
 * 브랜드 정보 설정
 ************************************/
export function useBrandSettings(workspaceId: string) {
  return useQuery({
    queryKey: brandKeys.settings(workspaceId),
    queryFn: () => getBrandSettings(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useUpdateBrandBasic(workspaceId: string) {
  const invalidateQueries = useInvalidateQueries();

  return useMutation({
    mutationFn: (body: UpdateBasicRequest) => updateBrandBasic(workspaceId, body),
    onSuccess: () => {
      invalidateQueries.single(brandKeys.settings(workspaceId));
    },
  });
}
