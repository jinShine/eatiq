import { BasePageSkeleton } from "@components/layout";
import { Skeleton } from "@components/ui";

const SKELETON_CARDS = 4;

/** 분석 결과가 있든 없든 도착 전에는 알 수 없으므로, 결과 화면 쪽 골격에 맞춘다 */
export default function MarketAnalysisLoading() {
  return (
    <BasePageSkeleton title="AI 상권 분석" description="국가·도시와 매장 조건을 입력해 AI 상권분석을 실행합니다.">
      <div className="border-border flex h-16 items-center justify-between gap-4 border-b px-6">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      <div
        role="status"
        aria-label="상권 분석 결과를 불러오는 중"
        className="grid flex-1 grid-cols-1 gap-6 p-6 xl:grid-cols-2"
      >
        {Array.from({ length: SKELETON_CARDS }).map((_, index) => (
          <div key={index} className="border-border flex flex-col gap-4 rounded-2xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-14 shrink-0 rounded-full" />
            </div>

            <Skeleton className="h-36 w-full rounded-xl" />

            <div className="flex gap-2">
              <Skeleton className="h-3.5 flex-1" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </BasePageSkeleton>
  );
}
