"use client";

import { useState } from "react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import PageHeader from "@components/layout/header/PageHeader";

import { CONTRACT_TYPE_OPTIONS, COUNTRY_FILTER_OPTIONS, type StageCode } from "../../_components/progressOptions";
import BuyerInfoCard from "../_components/BuyerInfoCard";
import NextActionSummaryCard from "../_components/NextActionSummaryCard";
import ProgressDetailHeader from "../_components/ProgressDetailHeader";
import ProgressTimeline from "../_components/ProgressTimeline";
import StageCard from "../_components/StageCard";
import { PROGRESS_DETAIL_MOCK } from "../_components/progressDetailMock";

const findLabel = (options: readonly { value: string; label: string }[], code: string) =>
  options.find(option => option.value === code)?.label ?? code;

type ProgressDetailContainerProps = {
  workspaceId: string;
  progressId: string;
};

export default function ProgressDetailContainer({ workspaceId }: ProgressDetailContainerProps) {
  // TODO(API): 상세 조회 API가 준비되면 useQuery(progressId)로 교체한다.
  const [detail, setDetail] = useState(PROGRESS_DETAIL_MOCK);

  const countryLabel = findLabel(COUNTRY_FILTER_OPTIONS, detail.countryCode);

  const handleStageChange = (stage: StageCode) => setDetail(prev => ({ ...prev, stage }));

  const handleToggleAction = (id: string, isDone: boolean) =>
    setDetail(prev => ({
      ...prev,
      nextActions: prev.nextActions.map(action => (action.id === id ? { ...action, isDone } : action)),
    }));

  return (
    <BaseContainerLayout
      header={<PageHeader title="진행 관리" description="파트너와의 소통 기록을 관리합니다." />}
      content={
        <div className="flex min-h-0 flex-1 flex-col">
          <ProgressDetailHeader
            buyerName={detail.buyerName}
            country={countryLabel}
            city={detail.city}
            backHref={`/${workspaceId}/progress`}
          />

          {/* 좌: 고정 폭 요약 패널 · 우: 스크롤되는 타임라인 */}
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <aside className="border-border flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-b p-6 lg:w-[354px] lg:border-r lg:border-b-0">
              <StageCard
                stage={detail.stage}
                classifiedAt={detail.classifiedAt}
                classifiedReason={detail.classifiedReason}
                onChange={handleStageChange}
              />

              <div className="h-px bg-[#f3f4f6]" />

              <BuyerInfoCard
                rows={[
                  { label: "국가", value: countryLabel },
                  { label: "도시", value: detail.city },
                  { label: "계약 방식", value: findLabel(CONTRACT_TYPE_OPTIONS, detail.contractType) },
                  { label: "담당자 이름", value: detail.contactName },
                  { label: "담당자 메일", value: detail.contactEmail },
                ]}
              />

              <div className="h-px bg-[#f3f4f6]" />

              <NextActionSummaryCard actions={detail.nextActions} onToggle={handleToggleAction} />
            </aside>

            <div className="min-w-0 flex-1 overflow-y-auto p-6">
              <ProgressTimeline />
            </div>
          </div>
        </div>
      }
    />
  );
}
