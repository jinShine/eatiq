import { BasePageSkeleton } from "@components/layout";
import { Skeleton } from "@components/ui";

const SKELETON_ROWS = 5;

/** 필터바 높이·목록 행 높이를 실제 화면과 맞춰 콘텐츠가 도착해도 튀지 않게 한다 */
export default function BuyerLoading() {
  return (
    <BasePageSkeleton title="바이어 탐색" description="해외 진출을 함께할 파트너를 찾아보세요">
      <div className="border-border flex h-16 items-center gap-2 border-b px-6">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      <ul role="status" aria-label="바이어 목록을 불러오는 중" className="bg-white">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <li key={index} className="border-border border-b px-7 py-[18px]">
            <div className="flex items-start gap-4">
              <Skeleton className="size-[60px] shrink-0 rounded-lg" />

              <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-full max-w-[420px]" />
                <Skeleton className="h-3 w-56" />
              </div>

              <Skeleton className="h-9 w-24 shrink-0 rounded-lg" />
            </div>
          </li>
        ))}
      </ul>
    </BasePageSkeleton>
  );
}
