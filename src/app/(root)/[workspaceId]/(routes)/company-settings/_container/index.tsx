"use client";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";

import { useCurrentWorkspace } from "@services/api/workspace/workspace.query";
import { type WorkspaceType } from "@services/api/workspace/workspace.type";

import CompanySettingsSkeleton from "../_components/CompanySettingsSkeleton";
import { type SettingsTabKey } from "../_components/SettingsTabNav";
import BrandSettings from "./BrandSettings";
import BuyerSettings from "./BuyerSettings";

/**
 * 화면 설명 — 우리 정보를 읽는 상대가 워크스페이스 종류에 따라 반대다.
 * 피그마 바이어 시안(961:10441)은 브랜드 문구를 그대로 복사해 둔 것이라 따르지 않는다.
 * 종류를 모르는 로딩 골격(CompanySettingsSkeleton)은 브랜드 문구를 쓴다 — 두 문구의 글자 수가 같아 바뀌어도 자리가 밀리지 않는다
 */
const DESCRIPTION_BY_TYPE: Record<WorkspaceType, string> = {
  brand: "회사의 매력을 AI와 바이어가 더 잘 이해할 수 있도록 정보를 입력해주세요",
  buyer: "회사의 매력을 AI와 브랜드가 더 잘 이해할 수 있도록 정보를 입력해주세요",
};

type CompanySettingsContainerProps = {
  workspaceId: string;
  activeTab: SettingsTabKey;
};

/**
 * 회사 정보 설정 — 워크스페이스 종류에 따라 화면이 다르다. 저장하는 데이터(API)가 달라서다 —
 * 브랜드는 섹션 13개를 탭 4개로, 바이어는 섹션 5개를 한 페이지로(피그마 961:10022).
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
      header={<PageHeader title="회사 정보 설정" description={DESCRIPTION_BY_TYPE[workspace.type]} />}
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
