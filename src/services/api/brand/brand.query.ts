import { useQuery } from "@tanstack/react-query";

import { getBrands } from "./brand.api";

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
};

export function useWorkspaces() {
  return useQuery({
    queryKey: brandKeys.list(),
    queryFn: getBrands,
    select: page => (page.content ?? []).map(toWorkspace),
  });
}
