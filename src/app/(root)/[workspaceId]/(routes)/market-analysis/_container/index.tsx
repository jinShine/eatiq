"use client";

import { useState } from "react";

import { Radar } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Button, Toast } from "@components/ui";

import StartAnalysisModal from "../_components/StartAnalysisModal";
import { type AnalysisConditionFormValues } from "../_components/analysisConditionSchema";

type MarketAnalysisContainerProps = {
  workspaceId: string;
};

export default function MarketAnalysisContainer({ workspaceId }: MarketAnalysisContainerProps) {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  // TODO(API): 분석 실행 API가 연결되면 진행 중 화면으로 전환하고 폴링한다
  const handleSubmitted = (values: AnalysisConditionFormValues) => {
    console.log(values);
    Toast.success("분석 조건을 확인했어요. 분석 실행은 API 연결 후 동작합니다.");
  };

  return (
    <BaseContainerLayout
      header={
        <PageHeader title="AI 상권 분석" description="국가·도시와 매장 조건을 입력해 AI 상권분석을 실행합니다." />
      }
      content={
        <BaseContentLayout>
          <div className="flex flex-1 items-center justify-center p-8">
            {/* TODO(API): 분석 이력이 생기면 결과 목록으로 대체한다 */}
            <div className="border-border flex flex-col items-center rounded-2xl border border-dashed bg-white px-6 py-20 text-center">
              <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
                <Radar className="size-5" strokeWidth={1.5} />
              </div>

              <p className="text-text-primary mt-5 text-sm font-semibold">아직 실행한 상권 분석이 없어요</p>
              <p className="text-text-tertiary mt-1.5 max-w-[38ch] text-xs leading-relaxed">
                진출하려는 국가·도시와 매장 조건을 입력하면 AI가 후보 매물을 찾아 분석해드려요.
              </p>

              <Button size="sm" className="mt-6" onClick={() => setIsStartModalOpen(true)}>
                AI 상권분석 시작
              </Button>
            </div>
          </div>

          <StartAnalysisModal
            workspaceId={workspaceId}
            isOpen={isStartModalOpen}
            onOpenChange={setIsStartModalOpen}
            onSubmitted={handleSubmitted}
          />
        </BaseContentLayout>
      }
    />
  );
}
