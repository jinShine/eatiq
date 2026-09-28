"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Toast } from "@components/ui";

import {
  useDeleteWorkspaceMutation,
  useInviteMembersMutation,
  useMyWorkspaces,
  useUpdateWorkspaceNameMutation,
  useWorkspaceDetail,
  useWorkspaceMembers,
} from "@services/api/workspace/workspace.query";
import { type WorkspaceMember } from "@services/api/workspace/workspace.type";

import ROUTES from "@constants/routes";

import DeleteWorkspaceModal from "../_components/DeleteWorkspaceModal";
import DeleteWorkspaceSection from "../_components/DeleteWorkspaceSection";
import InviteMemberModal from "../_components/InviteMemberModal";
import MemberRowMenu, { type MemberAction } from "../_components/MemberRowMenu";
import MemberSection from "../_components/MemberSection";
import WorkspaceNameSection, { type WorkspaceNameForm } from "../_components/WorkspaceNameSection";

export default function WorkspacesSettingsContainer({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data, isLoading } = useWorkspaceDetail(workspaceId);
  const { mutate: updateName, isPending: isUpdatingName } = useUpdateWorkspaceNameMutation(workspaceId);
  const { mutate: removeWorkspace, isPending: isDeleting } = useDeleteWorkspaceMutation(workspaceId);
  const { mutate: invite, isPending: isInviting } = useInviteMembersMutation(workspaceId);

  // 사이드바가 이미 부르고 있어 같은 queryKey의 캐시를 받는다. 요청은 한 번만 나간다
  const { data: workspaces = [] } = useMyWorkspaces();
  const { data: members = [], isLoading: isMembersLoading } = useWorkspaceMembers(workspaceId);

  const workspaceName = data?.name ?? "";

  // 내 등급은 서버가 my_member_info로 직접 알려준다. 멤버 목록에서 이메일로 찾지 않는다
  const myMember = workspaces.find(workspace => workspace.id === workspaceId)?.myMember;
  const isAdmin = myMember?.grade === "관리자";

  // 관리자에게만 메뉴가 보이고, 자기 자신 행에는 보이지 않는다 (피그마 규칙)
  const canManageMember = (member: WorkspaceMember) => isAdmin && member.id !== myMember?.id;

  const handleInvite: React.ComponentProps<typeof InviteMemberModal>["onSubmit"] = (emails, { setEmailError }) => {
    invite(
      { emails },
      {
        onSuccess: response => {
          // 실패한 항목은 모달에 남겨 그 칸에 사유를 붙인다.
          // 닫아버리면 무엇이 왜 실패했는지 알 수 없다
          if (response.failed_items.length > 0) {
            response.failed_items.forEach(item => setEmailError(item.email, item.reason));

            if (response.invited_count > 0) {
              Toast.success(`${response.invited_count}명을 초대했어요. 나머지는 확인이 필요해요.`);
            }
            return;
          }

          setIsInviteModalOpen(false);
          Toast.success(`${response.invited_count}명을 초대했어요.`);
        },
        onError: () => Toast.error("초대에 실패했어요. 다시 시도해주세요."),
      },
    );
  };

  // TODO(3덩이-2·3): 초대 취소·목록 삭제·내보내기·등급 변경을 연결한다
  const handleMemberAction = (action: MemberAction, member: WorkspaceMember) => {
    Toast.info(`${member.email} · ${action} — 다음 단계에서 연결합니다.`);
  };

  const handleUpdateName = (values: WorkspaceNameForm) => {
    updateName(values, {
      onSuccess: () => Toast.success("워크스페이스 이름을 변경했어요."),
      onError: () => Toast.error("이름 변경에 실패했어요. 다시 시도해주세요."),
    });
  };

  // 삭제한 워크스페이스에 머물 수 없으므로 루트로 보낸다.
  // 루트가 남은 워크스페이스 또는 빈 화면으로 다시 판단한다
  const handleDelete = () => {
    removeWorkspace(undefined, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        router.replace(ROUTES.ROOT);
      },
      onError: () => Toast.error("워크스페이스 삭제에 실패했어요."),
    });
  };

  return (
    <BaseContainerLayout
      header={<PageHeader title="워크스페이스 설정" description="워크스페이스의 사용자 및 상태를 관리합니다" />}
      content={
        <BaseContentLayout>
          {/* 이름이 도착하기 전에 섹션을 그리면 빈 입력이 한 번 보였다가 채워진다.
              loading.tsx가 같은 골격을 그리고 있어 여기서는 비워둔다 */}
          {!isLoading && (
            <div className="flex flex-col gap-5 px-6 py-6">
              <WorkspaceNameSection name={workspaceName} isPending={isUpdatingName} onSubmit={handleUpdateName} />

              <MemberSection
                members={members}
                isLoading={isMembersLoading}
                canInvite={isAdmin}
                renderMenu={member =>
                  canManageMember(member) ? <MemberRowMenu member={member} onSelect={handleMemberAction} /> : null
                }
                onInvite={() => setIsInviteModalOpen(true)}
              />

              <DeleteWorkspaceSection onRequestDelete={() => setIsDeleteModalOpen(true)} />
            </div>
          )}

          <InviteMemberModal
            isOpen={isInviteModalOpen}
            onOpenChange={setIsInviteModalOpen}
            isPending={isInviting}
            onSubmit={handleInvite}
          />

          <DeleteWorkspaceModal
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            workspaceName={workspaceName}
            isPending={isDeleting}
            onConfirm={handleDelete}
          />
        </BaseContentLayout>
      }
    />
  );
}
