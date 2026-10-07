"use client";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";

import { useCurrentWorkspace } from "@services/api/workspace/workspace.query";

import CompanySettingsSkeleton from "../_components/CompanySettingsSkeleton";
import { type SettingsTabKey } from "../_components/SettingsTabNav";
import BrandSettings from "./BrandSettings";
import BuyerSettings from "./BuyerSettings";

type CompanySettingsContainerProps = {
  workspaceId: string;
  activeTab: SettingsTabKey;
};

/**
 * 회사 정보 설정 — 워크스페이스 종류에 따라 화면이 다르다(피그마 「브랜드 / 바이어 차이점」).
 * 브랜드는 탭 4개, 바이어는 탭 없는 한 페이지. 메뉴·주소는 같다.
 */
export default function CompanySettingsContainer({ workspaceId, activeTab }: CompanySettingsContainerProps) {
  const workspace = useCurrentWorkspace(workspaceId);

  // 종류를 알기 전에는 어느 화면도 그리지 않는다 — 다른 화면의 요청이 먼저 나가지 않게
  if (!workspace) {
    return <CompanySettingsSkeleton />;
  }

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
          {workspace.type === "buyer" ? (
            <BuyerSettings workspaceId={workspaceId} />
          ) : (
            <BrandSettings workspaceId={workspaceId} activeTab={activeTab} />
          )}
        </BaseContentLayout>
      }
    />
  );
}
