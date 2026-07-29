"use client";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";

import SettingsTabNav, { type SettingsTabKey } from "../_components/SettingsTabNav";
import AreaCriteriaTab from "../_components/tabs/AreaCriteriaTab";
import BasicInfoTab from "../_components/tabs/BasicInfoTab";
import BrandVisualTab from "../_components/tabs/BrandVisualTab";
import PolicyTab from "../_components/tabs/PolicyTab";

type TabProps = { workspaceId: string };
const TAB_CONTENT: Record<SettingsTabKey, React.ComponentType<TabProps>> = {
  basic: BasicInfoTab,
  visual: BrandVisualTab,
  policy: PolicyTab,
  area: AreaCriteriaTab,
};

type BrandSettingsContainerProps = {
  workspaceId: string;
  activeTab: SettingsTabKey;
};

export default function BrandSettingsContainer({ workspaceId, activeTab }: BrandSettingsContainerProps) {
  const ActiveTab = TAB_CONTENT[activeTab] ?? BasicInfoTab;

  return (
    <BaseContainerLayout
      header={
        <PageHeader
          title="회사 정보 설정"
          description="회사의 매력을 AI와 바이어가 더 잘 이해할 수 있도록 정보를 입력해주세요"
        />
      }
      content={
        <BaseContentLayout>
          <SettingsTabNav workspaceId={workspaceId} activeTab={activeTab} />
          <div className="p-8">
            <ActiveTab workspaceId={workspaceId} />
          </div>
        </BaseContentLayout>
      }
    />
  );
}
