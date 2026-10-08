import { useBuyerDetail as useBuyerDetailQuery } from "@services/api/buyer/buyer.query";

import { toBuyerDetailView } from "../_components/buyerView";

/** 바이어 상세 — 드로어가 열려 있을 때만 받는다(buyerId가 없으면 조회하지 않는다) */
export function useBuyerDetail(buyerId: string | null) {
  const query = useBuyerDetailQuery(buyerId);

  return {
    detail: query.data ? toBuyerDetailView(query.data) : null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
