import { useBuyerDetail as useBuyerDetailQuery } from "@services/api/buyer/buyer.query";

import { toBuyerDetailView } from "../_components/buyerView";

/** 바이어 상세 — 드로어가 열려 있을 때만 받는다(buyerId가 없으면 조회하지 않는다) */
export function useBuyerDetail(buyerId: string | null) {
  const query = useBuyerDetailQuery(buyerId);

  return {
    detail: query.data ? toBuyerDetailView(query.data) : null,
    // 데이터가 없고(isPending) 요청 중이거나 멈춰 있을 때(fetchStatus "fetching"·"paused") 로딩으로 본다.
    // isLoading은 "fetching"일 때만 참이라, 오프라인·백그라운드로 다시 시도가 멈추면 빈 드로어가 뜬다.
    // 드로어가 닫혀 조회하지 않을 때는 fetchStatus가 "idle"이라 거짓이다
    isLoading: query.isPending && query.fetchStatus !== "idle",
    error: query.error,
  };
}
