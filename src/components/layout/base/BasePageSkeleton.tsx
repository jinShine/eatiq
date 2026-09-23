import { Skeleton } from "@components/ui";

import PageHeader from "../header/PageHeader";
import BaseContainerLayout from "./BaseContainerLayout";
import BaseContentLayout from "./BaseContentLayout";

type BasePageSkeletonProps = {
  /**
   * 화면 제목. 라우트가 정해진 뒤라면 알고 있는 값이므로 그대로 띄운다.
   * 아는 정보까지 회색 막대로 가리면 "아무것도 준비되지 않았다"는 인상만 준다.
   */
  title?: string;
  description?: string;
  /** 본문 자리. 화면마다 생김새가 달라 각 loading.tsx가 채운다 */
  children: React.ReactNode;
};

/**
 * 페이지 로딩 골격 — PageHeader + 본문.
 *
 * 스켈레톤의 목적은 "기다리는 중"을 알리는 게 아니라 레이아웃을 붙잡아두는 것이다.
 * 도착한 화면과 골격의 위치가 어긋나면 콘텐츠가 튀어서 오히려 더 산만해지므로,
 * 제목을 모를 때 쓰는 대체 헤더도 실제 PageHeader와 같은 높이·여백·보더를 쓴다.
 */
export default function BasePageSkeleton({ title, description, children }: BasePageSkeletonProps) {
  return (
    <BaseContainerLayout
      header={
        title ? (
          <PageHeader title={title} description={description} />
        ) : (
          <header className="bg-background sticky top-0 z-30 flex min-h-16 shrink-0 items-center justify-between gap-4 border-b px-6 py-3">
            <div className="flex min-w-0 flex-col gap-1.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="size-9 rounded-full" />
          </header>
        )
      }
      content={<BaseContentLayout>{children}</BaseContentLayout>}
    />
  );
}
