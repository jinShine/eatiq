import { Skeleton } from "@components/ui";

const SKELETON_ROWS = 4;

/** 요약·운영 브랜드 줄의 폭을 달리해 실제 데이터처럼 보이게 한다 (모두 같으면 로딩이 더 지루하다) */
const ROW_WIDTHS = [
  { summary: "w-[380px]", brands: "w-56" },
  { summary: "w-[300px]", brands: "w-44" },
  { summary: "w-[420px]", brands: "w-60" },
  { summary: "w-[340px]", brands: "w-48" },
];

/**
 * 바이어 목록 골격.
 *
 * 화면(로딩 중)과 loading.tsx가 같은 것을 쓴다. 두 벌로 나뉘면 행 높이가 어긋나
 * 스켈레톤에서 실제 목록으로 넘어갈 때 콘텐츠가 튄다.
 */
export default function BuyerListSkeleton() {
  return (
    <ul role="status" aria-label="바이어 목록을 불러오는 중" className="bg-white">
      {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
        <li key={index} className="border-border border-b px-7 py-[18px]">
          <div className="flex items-start gap-4">
            <Skeleton className="size-[60px] shrink-0 rounded-lg" />

            <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className={`h-3.5 max-w-full ${ROW_WIDTHS[index].summary}`} />
              <Skeleton className={`h-3 ${ROW_WIDTHS[index].brands}`} />
            </div>

            <Skeleton className="h-9 w-24 shrink-0 rounded-lg" />
          </div>
        </li>
      ))}
    </ul>
  );
}
