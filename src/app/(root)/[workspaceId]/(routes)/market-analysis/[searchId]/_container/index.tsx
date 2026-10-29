"use client";

import { useState } from "react";

import Link from "next/link";

import dayjs from "dayjs";
import { ArrowLeft, SearchX, TriangleAlert } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Button, Skeleton } from "@components/ui";

import { useStoreSearchDetail } from "@services/api/store-search/store-search.query";

import {
  STORE_SEARCH_DESCRIPTION,
  STORE_SEARCH_TITLE,
  type StoreListingView,
  toListingView,
} from "../../_components/storeSearchView";
import ListingCard from "../_components/ListingCard";
import ListingDetailSheet from "../_components/ListingDetailSheet";
import SearchConditionPanel from "../_components/SearchConditionPanel";

const SKELETON_CARDS = 4;

function ReportSkeleton() {
  return (
    <div role="status" aria-label="탐색 결과를 불러오는 중" className="flex flex-1 flex-col lg:flex-row">
      <div className="border-border flex flex-col gap-3 border-b px-6 py-6 lg:w-[354px] lg:border-r lg:border-b-0">
        <Skeleton className="h-5 w-20" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
      <div className="grid flex-1 grid-cols-1 gap-6 p-6 xl:grid-cols-2">
        {Array.from({ length: SKELETON_CARDS }).map((_, index) => (
          <div key={index} className="border-border overflow-hidden rounded-xl border">
            <Skeleton className="h-[200px] w-full rounded-none" />
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="mt-2 h-8 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportMessage({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof SearchX;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center px-6 py-20 text-center">
      <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <p className="text-text-primary mt-5 text-sm font-semibold">{title}</p>
      <p className="text-text-tertiary mt-1.5 max-w-[38ch] text-xs leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

type StoreSearchReportContainerProps = {
  workspaceId: string;
  searchId: string;
};

/**
 * 탐색 결과 리포트 (피그마 961:11781).
 * 시안의 제목 옆 메뉴(⋮)와 「상권 리포트 다운로드」는 API가 없어 두지 않는다.
 */
export default function StoreSearchReportContainer({ workspaceId, searchId }: StoreSearchReportContainerProps) {
  const { data, isLoading, error, refetch } = useStoreSearchDetail(searchId);
  const listings: StoreListingView[] =
    data?.result.map((listing, index) => toListingView(listing, index, data.search_condition.exchange_rate)) ?? [];

  // 드로어는 고른 카드의 id만 들고 있는다
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = listings.find(listing => listing.id === selectedId) ?? null;

  const listHref = `/${workspaceId}/market-analysis`;
  const title = data
    ? `${data.search_condition.country} · ${data.search_condition.city}${data.created_time ? ` | ${dayjs(data.created_time).format("YYYY.MM.DD")}` : ""}`
    : "탐색 결과";

  const renderContent = () => {
    if (isLoading) {
      return <ReportSkeleton />;
    }
    if (error || !data) {
      return (
        <ReportMessage
          icon={TriangleAlert}
          title="탐색 결과를 불러오지 못했어요"
          description={error?.message ?? "잠시 후 다시 시도해주세요."}
          action={
            <Button variant="outline" size="sm" className="mt-6" onClick={() => refetch()}>
              다시 시도
            </Button>
          }
        />
      );
    }
    return (
      <div className="flex flex-1 flex-col lg:flex-row">
        <SearchConditionPanel condition={data.search_condition} createdTime={data.created_time} />

        {listings.length === 0 ? (
          // 결과 0건도 완료로 처리된다(설계 노트 961:12487)
          <ReportMessage
            icon={SearchX}
            title="조건에 맞는 매물을 찾지 못했어요"
            description="평형·임대료 범위를 넓히거나 층수를 「전체」로 바꿔 다시 탐색해보세요."
            action={
              <Button asChild variant="outline" size="sm" className="mt-6">
                <Link href={listHref}>목록으로</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid flex-1 grid-cols-1 content-start gap-6 p-6 xl:grid-cols-2">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} onOpenDetail={setSelectedId} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseContainerLayout
      header={<PageHeader title={STORE_SEARCH_TITLE} description={STORE_SEARCH_DESCRIPTION} />}
      content={
        <BaseContentLayout>
          <div className="border-border flex h-16 shrink-0 items-center gap-3 border-b px-6">
            {/* 시안에는 없지만 리포트로 들어온 경로를 되짚을 수단이 필요하다 */}
            <Link
              href={listHref}
              aria-label="상가 매물 탐색 목록으로"
              className="text-text-tertiary hover:bg-secondary-background hover:text-text-primary focus-visible:ring-ring flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowLeft className="size-4" />
            </Link>
            {isLoading ? (
              <Skeleton className="h-6 w-56" />
            ) : (
              <h2 className="text-text-primary truncate text-[22px] font-bold tracking-[-1.1px]">{title}</h2>
            )}
          </div>

          {renderContent()}

          <ListingDetailSheet
            listing={selected}
            isOpen={selected !== null}
            onOpenChange={open => !open && setSelectedId(null)}
          />
        </BaseContentLayout>
      }
    />
  );
}
