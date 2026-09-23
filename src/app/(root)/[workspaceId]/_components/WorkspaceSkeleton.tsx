import { BasePageSkeleton } from "@components/layout";
import { Skeleton } from "@components/ui";

/**
 * 어떤 화면인지 아직 모를 때 쓰는 기본 골격.
 *
 * 멤버십을 확인하는 동안에는 목적지 라우트의 생김새를 알 수 없어서,
 * 어느 화면에 놓여도 크게 어긋나지 않는 "지표 카드 + 목록" 형태로 둔다.
 * 화면이 특정된 뒤에는 각 라우트의 loading.tsx가 더 정확한 골격을 그린다.
 */
export default function WorkspaceSkeleton() {
  return (
    <BasePageSkeleton>
      <div className="flex flex-col gap-6 px-6 py-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border-border flex flex-col gap-3 rounded-xl border p-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-24" />
            </div>
          ))}
        </div>

        <div className="border-border flex flex-col rounded-xl border">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-border flex items-center gap-4 border-b px-4 py-4 last:border-b-0">
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </BasePageSkeleton>
  );
}
