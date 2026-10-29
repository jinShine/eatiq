import { BasePageSkeleton } from "@components/layout";
import { Skeleton } from "@components/ui";

import StoreSearchTableSkeleton from "./_components/StoreSearchTableSkeleton";
import { STORE_SEARCH_DESCRIPTION, STORE_SEARCH_TITLE } from "./_components/storeSearchView";

/** 표 골격은 화면이 이미 쓰는 것을 그대로 재사용한다 — 두 벌로 나뉘면 열 폭이 어긋난다 */
export default function MarketAnalysisLoading() {
  return (
    <BasePageSkeleton title={STORE_SEARCH_TITLE} description={STORE_SEARCH_DESCRIPTION}>
      <div className="border-border flex h-16 items-center gap-2 border-b px-6">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
        <Skeleton className="ml-auto h-9 w-32 rounded-lg" />
      </div>

      <div className="px-6 py-6">
        <StoreSearchTableSkeleton />
      </div>
    </BasePageSkeleton>
  );
}
