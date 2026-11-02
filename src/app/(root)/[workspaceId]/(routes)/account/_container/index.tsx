"use client";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";

import { useAccountMe, useLogoutMutation } from "@services/api/account/account.query";
import { useCurrentWorkspace } from "@services/api/workspace/workspace.query";

import AccountInfoSection from "../_components/AccountInfoSection";
import AccountManageSection from "../_components/AccountManageSection";

export default function AccountContainer({ workspaceId }: { workspaceId: string }) {
  const { data: me, isLoading } = useAccountMe();
  const workspace = useCurrentWorkspace(workspaceId);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  return (
    <BaseContainerLayout
      header={<PageHeader title="내 정보 설정" description="계정 정보와 로그인 상태를 관리합니다." />}
      content={
        <BaseContentLayout>
          {/* 항목이 적어 넓게 펴면 라벨과 값·버튼이 멀어진다. 시안대로 가운데 좁은 폭에 둔다 */}
          <div className="mx-auto flex w-full max-w-[619px] flex-col gap-6 px-6 py-6 sm:px-0">
            <AccountInfoSection email={me?.email} name={me?.name} isLoading={isLoading} />
            <AccountManageSection
              workspaceName={workspace?.name}
              isLoggingOut={isLoggingOut}
              onLogout={() => logout()}
              // 모달은 다음 단계에서 붙인다
              onWithdrawWorkspace={() => {}}
              onDeleteAccount={() => {}}
            />
          </div>
        </BaseContentLayout>
      }
    />
  );
}
