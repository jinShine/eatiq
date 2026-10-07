import { BasePageSkeleton } from "@components/layout";
import { Skeleton } from "@components/ui";

const TAB_WIDTHS = ["w-20", "w-24", "w-16", "w-20"];

const SKELETON_SECTIONS = 2;

type CompanySettingsSkeletonProps = {
  /** 브랜드는 탭이 있다. 워크스페이스 종류를 모를 때(첫 로딩)는 탭 없이 섹션만 그린다 */
  withTabs?: boolean;
};

/** 헤더는 그대로 두고, 아래 폼 섹션만 골격으로 채운다 */
export default function CompanySettingsSkeleton({ withTabs = false }: CompanySettingsSkeletonProps) {
  return (
    <BasePageSkeleton
      title="회사 정보 설정"
      description="회사의 매력을 AI와 바이어가 더 잘 이해할 수 있도록 정보를 입력해주세요"
    >
      {withTabs && (
        <nav className="border-border flex gap-1 border-b px-5" aria-hidden>
          {TAB_WIDTHS.map((width, index) => (
            <div key={index} className="px-4 py-3.5">
              <Skeleton className={`h-4 ${width}`} />
            </div>
          ))}
        </nav>
      )}

      <div role="status" aria-label="회사 정보를 불러오는 중" className="flex flex-col gap-5 px-6 py-6">
        {Array.from({ length: SKELETON_SECTIONS }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="border-border overflow-hidden rounded-2xl border">
            <div className="border-border flex flex-col gap-2 border-b px-6 py-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-64" />
            </div>

            <div className="space-y-4 p-6">
              {Array.from({ length: 3 }).map((_, fieldIndex) => (
                <div key={fieldIndex} className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              ))}
            </div>

            <div className="border-border bg-secondary-background flex items-center justify-between border-t px-7 py-4">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </BasePageSkeleton>
  );
}
