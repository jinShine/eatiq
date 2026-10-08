"use client";

import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { type BrandSettingsTab, useBrandCompletion, useBrandCompletions } from "@services/api/brand/brand.query";

import { SETTINGS_TABS } from "../SettingsTabNav";
import CompletionPanel, { CompletionPanelSkeleton, focusRing } from "./CompletionPanel";
import { BRAND_JOURNEY_STAGES } from "./journeyStages";

type CompletionStatusCardProps = {
  workspaceId: string;
  tab: BrandSettingsTab;
  tabLabel: string; // 제목에 붙는 탭 이름 — "정보 완성 현황 - 기본 정보"
};

/** 브랜드 탭별 정보 완성 현황 — 화면은 CompletionPanel, 여기서는 탭별 데이터와 「다음 탭」 안내만 */
export default function CompletionStatusCard({ workspaceId, tab, tabLabel }: CompletionStatusCardProps) {
  const { data: completion, isLoading } = useBrandCompletion(workspaceId, tab);

  // 이 탭을 다 채우면 다음으로 채울 탭을 안내한다. 현재 탭 다음부터 한 바퀴 돌며 덜 채운 첫 탭
  const isTabDone = completion ? !completion.nextTask : false;
  const tabIndex = SETTINGS_TABS.findIndex(settingsTab => settingsTab.key === tab);
  const otherTabs = [...SETTINGS_TABS.slice(tabIndex + 1), ...SETTINGS_TABS.slice(0, tabIndex)];
  const otherCompletions = useBrandCompletions(
    workspaceId,
    otherTabs.map(settingsTab => settingsTab.key),
    isTabDone,
  );
  const nextTab = otherTabs.find((_, index) => otherCompletions[index]?.data?.nextTask);
  const isAllTabsDone = otherCompletions.every(query => query.data && !query.data.nextTask);

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
      doneContent={
        <>
          <div className="flex-1 space-y-1">
            <p className="text-text-primary text-base font-bold">{tabLabel} 입력을 마쳤어요</p>
            <p className="text-text-tertiary text-xs leading-relaxed">
              {nextTab
                ? `${nextTab.label} 탭도 이어서 채워 보세요`
                : isAllTabsDone
                  ? "모든 탭의 정보를 채웠어요"
                  : "다른 탭의 진행 상황을 확인하고 있어요"}
            </p>
          </div>
          {nextTab && (
            <Link
              href={`/${workspaceId}/company-settings?tab=${nextTab.key}`}
              className={`bg-primary text-primary-foreground hover:bg-primary-emphasis group inline-flex w-fit items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${focusRing}`}
            >
              {nextTab.label} 바로가기
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </>
      }
    />
  );
}
