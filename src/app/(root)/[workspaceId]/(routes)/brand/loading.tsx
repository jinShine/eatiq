import { BasePageSkeleton } from "@components/layout";
import { Skeleton } from "@components/ui";

import BrandGridSkeleton from "./_components/BrandGridSkeleton";

/** 카드 골격은 화면이 이미 쓰는 것을 그대로 재사용한다 — 두 벌로 나뉘면 카드 높이가 어긋난다 */
export default function BrandLoading() {
  return (
    <BasePageSkeleton title="브랜드 탐색" description="우리 회사와 잘 맞는 파트너를 찾아보세요">
      <div className="border-border flex h-16 items-center gap-2 border-b px-6">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <BrandGridSkeleton />
    </BasePageSkeleton>
  );
}
