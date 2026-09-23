import { BasePageSkeleton } from "@components/layout";
import { Skeleton } from "@components/ui";

import ProgressTableSkeleton from "./_components/ProgressTableSkeleton";

/** 표 골격은 화면이 이미 쓰는 것을 그대로 재사용한다 — 두 벌로 나뉘면 열 폭이 어긋난다 */
export default function ProgressLoading() {
  return (
    <BasePageSkeleton title="진행 관리" description="파트너와의 소통 기록을 관리합니다.">
      <div className="border-border flex h-16 items-center gap-2 border-b px-6">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      <div className="px-6 py-6">
        <ProgressTableSkeleton />
      </div>
    </BasePageSkeleton>
  );
}
