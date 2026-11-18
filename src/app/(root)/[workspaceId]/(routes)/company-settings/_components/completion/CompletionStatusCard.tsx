"use client";

import { type BrandSettingsTab, useBrandCompletion } from "@services/api/brand/brand.query";

import CompletionPanel, { CompletionPanelSkeleton } from "./CompletionPanel";
import { BRAND_JOURNEY_STAGES } from "./journeyStages";

type CompletionStatusCardProps = {
  workspaceId: string;
  tab: BrandSettingsTab;
  tabLabel: string; // 제목에 붙는 탭 이름 — "정보 완성 현황 - 기본 정보"
};

/** 브랜드 탭별 정보 완성 현황 — 화면은 CompletionPanel, 여기서는 탭별 데이터만 */
export default function CompletionStatusCard({ workspaceId, tab, tabLabel }: CompletionStatusCardProps) {
  const { data: completion, isLoading } = useBrandCompletion(workspaceId, tab);

  if (isLoading) {
    return <CompletionPanelSkeleton />;
  }
  if (!completion) {
    return null;
  }

  return (
    <CompletionPanel
      title={`정보 완성 현황 - ${tabLabel}`}
      completion={completion}
      stages={BRAND_JOURNEY_STAGES}
      progressLabel={`${tabLabel} 완성률`}
    />
  );
}
