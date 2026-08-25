import { useMemo } from "react";

import { BUYER_DETAIL_MOCK, type BuyerDetail, buildFallbackDetail } from "../_components/buyerDetailMock";

/**
 * 바이어 상세 조회.
 *
 * TODO(API): 상세 API가 준비되면 `useQuery`로 교체한다.
 * buyerId가 없으면(드로어가 닫힌 상태) 조회하지 않는다.
 */
export function useBuyerDetail(buyerId: string | null): BuyerDetail | null {
  return useMemo(() => {
    if (!buyerId) {
      return null;
    }
    return BUYER_DETAIL_MOCK[buyerId] ?? buildFallbackDetail(buyerId);
  }, [buyerId]);
}
