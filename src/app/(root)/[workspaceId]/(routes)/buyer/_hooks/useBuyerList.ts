import { useEffect, useMemo, useState } from "react";

import { BUYER_MOCK, type BuyerRow } from "../_components/buyerMock";

type UseBuyerListResult = {
  buyers: BuyerRow[];
  isLoading: boolean;
};

/**
 * 바이어 목록 조회.
 *
 * TODO(API): 목록 API가 준비되면 useQuery로 교체한다. 반환 모양을
 * { buyers, isLoading }으로 맞춰뒀으므로 이 훅 안만 바꾸면 된다.
 */
export function useBuyerList(workspaceId: string): UseBuyerListResult {
  // TODO(API): 목업 단계에서 로딩 UI를 확인하기 위한 임시 상태다
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const buyers = useMemo(() => (workspaceId ? BUYER_MOCK : []), [workspaceId]);

  return { buyers, isLoading };
}
