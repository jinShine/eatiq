import { useCrmDetail } from "@services/api/crm/crm.query";

import { toProgressDetailView } from "../_components/progressDetailView";

/** 진행 관리 상세 — 응답을 화면 뷰모델로 바꾼다 */
export function useProgressDetail(crmId: string) {
  const query = useCrmDetail(crmId);

  return {
    detail: query.data ? toProgressDetailView(query.data) : null,
    isLoading: query.isLoading,
    error: query.error,
    retry: () => query.refetch(),
  };
}
