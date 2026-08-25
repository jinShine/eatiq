import { useMemo } from "react";

import { BUYER_MOCK, type BuyerRow } from "../_components/buyerMock";

/**
 * 바이어 목록 조회.
 *
 * TODO(API): 목록 API가 준비되면 `useQuery`로 교체한다.
 * 워크스페이스별 조회이므로 시그니처는 그대로 두고 내부만 바꾸면 된다.
 */
export function useBuyerList(workspaceId: string): BuyerRow[] {
  return useMemo(() => (workspaceId ? BUYER_MOCK : []), [workspaceId]);
}
