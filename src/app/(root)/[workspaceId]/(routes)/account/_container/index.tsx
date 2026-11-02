"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Toast } from "@components/ui";

import { useAccountMe, useDeleteAccountMutation, useLogoutMutation } from "@services/api/account/account.query";
import {
  useCurrentWorkspace,
  useWithdrawWorkspaceMutation,
  useWorkspaceMembers,
} from "@services/api/workspace/workspace.query";

import ROUTES from "@constants/routes";

import AccountErrorModal, { type AccountError } from "../_components/AccountErrorModal";
import AccountInfoSection from "../_components/AccountInfoSection";
import AccountManageSection from "../_components/AccountManageSection";
import DeleteAccountModal from "../_components/DeleteAccountModal";
import WithdrawWorkspaceModal from "../_components/WithdrawWorkspaceModal";

export default function AccountContainer({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<AccountError | null>(null);

  const { data: me, isLoading } = useAccountMe();
  const workspace = useCurrentWorkspace(workspaceId);
  const { data: members } = useWorkspaceMembers(workspaceId);

  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawWorkspaceMutation(workspaceId);
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccountMutation();

  // 거절 판단은 서버가 한다. 여기선 "나가면 워크스페이스가 지워지는가"만 미리 알려주려고 센다.
  // 활성·초대중만 남은 멤버로 친다(서버 기준). 목록엔 스펙에 없는 "강제탈퇴"도 섞여 와서
  // 제외 목록이 아니라 포함 목록으로 센다. 목록을 받기 전에는 경고를 띄우지 않는다
  const isLastMember =
    members !== undefined &&
    !members.some(
      member => member.id !== workspace?.myMember.id && (member.status === "활성" || member.status === "초대중"),
    );

  const handleWithdraw = () => {
    withdraw(undefined, {
      onSuccess: response => {
        setIsWithdrawModalOpen(false);
        Toast.success(
          response.is_workspace_deleted
            ? `${workspace?.name ?? "워크스페이스"}에서 나가고 워크스페이스를 삭제했어요.`
            : `${workspace?.name ?? "워크스페이스"}에서 나갔어요.`,
        );
        // 나간 워크스페이스에 머물 수 없다. 루트가 남은 워크스페이스 또는 빈 화면으로 보낸다.
        // 목록 갱신은 mutation이 기다린 뒤라 루트가 옛 목록으로 되돌아오지 않는다
        router.replace(ROUTES.ROOT);
      },
      onError: e => {
        setIsWithdrawModalOpen(false);
        setError({ title: "워크스페이스 탈퇴 실패", message: e.message || "탈퇴하지 못했어요. 다시 시도해주세요." });
      },
    });
  };

  const handleDeleteAccount = () => {
    deleteAccount(undefined, {
      // 세션 정리와 로그인 화면 이동은 mutation이 한다
      onSuccess: () => Toast.success("계정을 삭제했어요."),
      onError: e => {
        setIsDeleteModalOpen(false);
        setError({ title: "계정 삭제 실패", message: e.message || "계정을 삭제하지 못했어요. 다시 시도해주세요." });
      },
    });
  };

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
              onWithdrawWorkspace={() => setIsWithdrawModalOpen(true)}
              onDeleteAccount={() => setIsDeleteModalOpen(true)}
            />
          </div>

          <WithdrawWorkspaceModal
            isOpen={isWithdrawModalOpen}
            onOpenChange={setIsWithdrawModalOpen}
            workspaceName={workspace?.name}
            isLastMember={isLastMember}
            isPending={isWithdrawing}
            onConfirm={handleWithdraw}
          />

          <DeleteAccountModal
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            isPending={isDeleting}
            onConfirm={handleDeleteAccount}
          />

          <AccountErrorModal error={error} onClose={() => setError(null)} />
        </BaseContentLayout>
      }
    />
  );
}
