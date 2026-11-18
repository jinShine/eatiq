"use client";

import { useBuyerCompletion } from "@services/api/buyer/buyer.query";

import CompletionPanel, { CompletionPanelSkeleton } from "./CompletionPanel";
import { BUYER_JOURNEY_STAGES } from "./journeyStages";

type BuyerCompletionCardProps = {
  workspaceId: string;
};

/** 바이어 정보 완성 현황 — 탭이 없어 페이지 전체를 한 번에 센다(완성까지 3단계) */
export default function BuyerCompletionCard({ workspaceId }: BuyerCompletionCardProps) {
  const { data: completion, isLoading } = useBuyerCompletion(workspaceId);

  if (isLoading) {
    return <CompletionPanelSkeleton />;
  }
  if (!completion) {
    return null;
  }

  return (
    <CompletionPanel
      title="정보 완성 현황"
      completion={completion}
      stages={BUYER_JOURNEY_STAGES}
      progressLabel="회사 정보 완성률"
    />
  );
}
