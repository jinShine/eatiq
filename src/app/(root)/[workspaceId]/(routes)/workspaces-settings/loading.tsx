import { BasePageSkeleton } from "@components/layout";
import { Skeleton } from "@components/ui";

/** 이름 카드 + 삭제 카드 두 장. 멤버 표는 3덩이 작업에서 함께 추가한다 */
export default function WorkspacesSettingsLoading() {
  return (
    <BasePageSkeleton title="워크스페이스 설정" description="워크스페이스의 사용자 및 상태를 관리합니다">
      <div role="status" aria-label="워크스페이스 설정을 불러오는 중" className="flex flex-col gap-5 px-6 py-6">
        <div className="border-border overflow-hidden rounded-2xl border">
          <div className="border-border border-b px-6 py-4">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-col gap-2 p-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="border-border bg-secondary-background flex justify-end border-t px-7 py-4">
            <Skeleton className="h-9 w-16 rounded-lg" />
          </div>
        </div>

        <div className="border-border overflow-hidden rounded-2xl border">
          <div className="border-border border-b px-6 py-4">
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center justify-between gap-6 p-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-72" />
            </div>
            <Skeleton className="h-9 w-32 shrink-0 rounded-lg" />
          </div>
        </div>
      </div>
    </BasePageSkeleton>
  );
}
