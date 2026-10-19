"use client";

import { TriangleAlert } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Button, Skeleton } from "@components/ui";

import ActivitySection from "../_components/ActivitySection";
import InviteBanner from "../_components/InviteBanner";
import JourneySection from "../_components/JourneySection";
import NextActionSection from "../_components/NextActionSection";
import PipelineSection from "../_components/PipelineSection";
import { useDashboard } from "../_hooks/useDashboard";

function DashboardSkeleton() {
  return (
    <div role="status" aria-label="대시보드를 불러오는 중" className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-[140px] w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-[120px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[104px] w-full rounded-xl" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

type DashboardContainerProps = {
  workspaceId: string;
};

/**
 * 대시보드 (피그마 59:7172) — 다음 행동을 알려주는 화면.
 * 초대 배너 · 저니 패널 · 이번 주 Next Action · 업무 진행 현황 · 최근 활동.
 * 시안의 「이 주의 추천 파트너」는 추천 API가 없어 그리지 않는다.
 */
export default function DashboardContainer({ workspaceId }: DashboardContainerProps) {
  const { workspaceType, dashboard, isLoading, error, retry } = useDashboard(workspaceId);

  const renderContent = () => {
    if (isLoading) {
      return <DashboardSkeleton />;
    }
    if (error || !dashboard) {
      return (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
            <TriangleAlert className="size-5" strokeWidth={1.5} />
          </div>
          <p className="text-text-primary mt-5 text-sm font-semibold">대시보드를 불러오지 못했어요</p>
          {error && <p className="text-text-tertiary mt-1.5 text-xs">{error.message}</p>}
          <Button variant="outline" size="sm" className="mt-6" onClick={retry}>
            다시 시도
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-8">
        <JourneySection workspaceId={workspaceId} isBuyer={workspaceType === "buyer"} dashboard={dashboard} />
        <NextActionSection workspaceId={workspaceId} actions={dashboard.nextActions} />
        <PipelineSection workspaceId={workspaceId} stageCounts={dashboard.stageCounts} />
        <ActivitySection workspaceId={workspaceId} activities={dashboard.activities} />
      </div>
    );
  };

  return (
    <BaseContainerLayout
      header={<PageHeader title="대시보드" description="지금 진행 중인 일과 다음 액션을 한눈에 확인하세요" />}
      content={
        <BaseContentLayout>
          <div className="flex flex-col gap-6 px-6 py-8">
            {/* 받은 초대가 있을 때만 맨 위에 — 대시보드 데이터와 따로 받는다 */}
            <InviteBanner />
            {renderContent()}
          </div>
        </BaseContentLayout>
      }
    />
  );
}
