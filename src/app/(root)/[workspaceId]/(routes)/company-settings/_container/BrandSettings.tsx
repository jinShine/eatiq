"use client";

import SettingsTabNav, { type SettingsTabKey } from "../_components/SettingsTabNav";
import AreaCriteriaTab from "../_components/tabs/AreaCriteriaTab";
import BasicInfoTab from "../_components/tabs/BasicInfoTab";
import BrandVisualTab from "../_components/tabs/BrandVisualTab";
import PolicyTab from "../_components/tabs/PolicyTab";
import { useJumpToHash } from "../_hooks/useJumpToHash";

type TabProps = { workspaceId: string };
const TAB_CONTENT: Record<SettingsTabKey, React.ComponentType<TabProps>> = {
  basic: BasicInfoTab,
  visual: BrandVisualTab,
  policy: PolicyTab,
  area: AreaCriteriaTab,
};

type BrandSettingsProps = {
  workspaceId: string;
  activeTab: SettingsTabKey;
};

/** 브랜드 워크스페이스의 회사 정보 설정 — 탭 4개 */
export default function BrandSettings({ workspaceId, activeTab }: BrandSettingsProps) {
  // 대시보드의 「입력」(…#섹션/필드)으로 들어오면 그 칸으로 이동한다
  useJumpToHash();
  const ActiveTab = TAB_CONTENT[activeTab] ?? BasicInfoTab;

  return (
    <>
      <SettingsTabNav workspaceId={workspaceId} activeTab={activeTab} />
      <ActiveTab workspaceId={workspaceId} />
    </>
  );
}
