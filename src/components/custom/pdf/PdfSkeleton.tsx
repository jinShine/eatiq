import { Skeleton } from "@components/ui";

type PdfSkeletonProps = {
  /** 폭(px). 없으면 영역 폭 */
  width?: number;
  /** 폭 / 높이 — 기본 A4 세로 */
  aspectRatio?: number;
};

/** 문서를 받는 동안·만드는 동안 보이는 빈 쪽 (피그마 2262:10418 Card 스켈레톤) */
export default function PdfSkeleton({ width, aspectRatio = 1 / 1.414 }: PdfSkeletonProps) {
  return (
    <div
      className="border-border flex w-full flex-col gap-4 rounded-sm border bg-white p-4 shadow-sm"
      style={{ width, aspectRatio }}
      aria-busy
      aria-label="문서를 불러오는 중"
    >
      <div className="flex items-center gap-4">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
