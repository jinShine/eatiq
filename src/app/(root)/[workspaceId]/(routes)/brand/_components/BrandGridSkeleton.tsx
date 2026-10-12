import { Skeleton } from "@components/ui";

import { BRAND_GRID_CLASS } from "./BrandGrid";

const SKELETON_CARDS = 6;

/**
 * 브랜드 카드 골격. 화면(로딩 중)과 loading.tsx가 같은 것을 쓴다 —
 * 두 벌로 나뉘면 카드 높이가 어긋나 실제 목록으로 넘어갈 때 콘텐츠가 튄다.
 */
export default function BrandGridSkeleton() {
  return (
    <div className="px-6 pt-6">
      <ul role="status" aria-label="브랜드 목록을 불러오는 중" className={BRAND_GRID_CLASS}>
        {Array.from({ length: SKELETON_CARDS }).map((_, index) => (
          <li key={index} className="border-border overflow-hidden rounded-xl border bg-white">
            <Skeleton className="h-[200px] w-full rounded-none" />
            <div className="flex flex-col gap-2 px-4 pt-3 pb-6">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="mt-3 h-4 w-48" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-3 h-8 w-full rounded-lg" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
