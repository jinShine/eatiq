import { useBrandDashboard } from "@services/api/brand/brand.query";
import { useBuyerDashboard } from "@services/api/buyer/buyer.query";
import { useCurrentWorkspace } from "@services/api/workspace/workspace.query";

import { toBrandDashboardView, toBuyerDashboardView } from "../_components/dashboardView";

/**
 * 대시보드 — 워크스페이스 유형에 맞는 API를 부르고 같은 뷰모델로 바꾼다.
 * 유형을 알기 전(워크스페이스 목록 로딩 중)에는 어느 쪽도 부르지 않는다.
 */
export function useDashboard(workspaceId: string) {
  const workspace = useCurrentWorkspace(workspaceId);
  const isBrand = workspace?.type === "brand";
  const isBuyer = workspace?.type === "buyer";

  const brandQuery = useBrandDashboard(workspaceId, isBrand);
  const buyerQuery = useBuyerDashboard(workspaceId, isBuyer);
  const query = isBuyer ? buyerQuery : brandQuery;

  const dashboard = isBrand
    ? brandQuery.data && toBrandDashboardView(workspaceId, brandQuery.data)
    : buyerQuery.data && toBuyerDashboardView(workspaceId, buyerQuery.data);

  return {
    workspaceType: workspace?.type,
    dashboard: dashboard ?? null,
    isLoading: !workspace || query.isLoading,
    error: query.error,
    retry: () => query.refetch(),
  };
}
