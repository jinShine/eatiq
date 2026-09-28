import { BasePageSkeleton } from "@components/layout";
import { Skeleton } from "@components/ui";

import BuyerListSkeleton from "./_components/BuyerListSkeleton";

/** 목록 골격은 화면이 이미 쓰는 것을 그대로 재사용한다 — 두 벌로 나뉘면 행 높이가 어긋난다 */
export default function BuyerLoading() {
  return (
    <BasePageSkeleton title="바이어 탐색" description="해외 진출을 함께할 파트너를 찾아보세요">
      <div className="border-border flex h-16 items-center gap-2 border-b px-6">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      <BuyerListSkeleton />
    </BasePageSkeleton>
  );
}
