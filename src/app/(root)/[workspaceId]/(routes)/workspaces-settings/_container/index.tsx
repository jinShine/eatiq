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
  useRemoveRejectedMemberMutation,
  useUpdateMemberGradeMutation,
  useUpdateMemberStatusMutation,
  useUpdateWorkspaceNameMutation,
  useWorkspaceDetail,
  useWorkspaceMembers,
} from "@services/api/workspace/workspace.query";
import { type WorkspaceMember } from "@services/api/workspace/workspace.type";

import ROUTES from "@constants/routes";

import DeleteWorkspaceModal from "../_components/DeleteWorkspaceModal";
import DeleteWorkspaceSection from "../_components/DeleteWorkspaceSection";
import InviteMemberModal from "../_components/InviteMemberModal";
import MemberConfirmModal, { type MemberConfirmKind } from "../_components/MemberConfirmModal";
import MemberRowMenu, { type MemberAction } from "../_components/MemberRowMenu";
import MemberSection from "../_components/MemberSection";
import WorkspaceNameSection, { type WorkspaceNameForm } from "../_components/WorkspaceNameSection";

export default function WorkspacesSettingsContainer({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  /** 확인이 필요한 액션은 대상 멤버와 종류를 함께 들고 있어야 문구를 채울 수 있다 */
  const [confirm, setConfirm] = useState<{ kind: MemberConfirmKind; member: WorkspaceMember } | null>(null);

  const { data, isLoading } = useWorkspaceDetail(workspaceId);
  const { mutate: updateName, isPending: isUpdatingName } = useUpdateWorkspaceNameMutation(workspaceId);
  const { mutate: removeWorkspace, isPending: isDeleting } = useDeleteWorkspaceMutation(workspaceId);
  const { mutate: invite, isPending: isInviting } = useInviteMembersMutation(workspaceId);
  const { mutate: updateGrade, isPending: isUpdatingGrade } = useUpdateMemberGradeMutation(workspaceId);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateMemberStatusMutation(workspaceId);
  const { mutate: removeRejected, isPending: isRemoving } = useRemoveRejectedMemberMutation(workspaceId);

  /** 처리 중에는 모든 행 메뉴를 잠근다. 목록이 갱신되기 전에 같은 대상을 또 누를 수 있다 */
  const isMemberActionPending = isUpdatingGrade || isUpdatingStatus || isRemoving || isInviting;

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
            // 서버가 준 이메일이 입력 칸과 맞지 않을 수 있다(정규화·별칭 등).
            // 어디에도 붙이지 못한 실패를 그냥 두면 이유 없이 막힌 화면이 된다
            const unmatched = response.failed_items.filter(item => !setEmailError(item.email, item.reason));

            if (unmatched.length > 0) {
              Toast.error(unmatched.map(item => `${item.email}: ${item.reason}`).join("\n"));
            }

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

  /** 서버가 준 문구가 훨씬 정확하다 — "마지막 관리자는 강등할 수 없습니다" 같은 안내가 그대로 온다 */
  const toastError = (error: Error, fallback: string) => Toast.error(error.message || fallback);

  const handleMemberAction = (action: MemberAction, member: WorkspaceMember) => {
    // 되돌리기 어려운 둘만 확인을 받는다. 나머지는 눌렀을 때 바로 처리한다
    if (action === "changeGrade" || action === "remove") {
      setConfirm({ kind: action, member });
      return;
    }

    if (action === "cancelInvite") {
      updateStatus(
        { memberId: member.id, status: "초대취소" },
        {
          onSuccess: () => Toast.success("초대를 취소했어요."),
          onError: error => toastError(error, "초대 취소에 실패했어요."),
        },
      );
      return;
    }

    if (action === "deleteFromList") {
      removeRejected(member.id, {
        onSuccess: () => Toast.success("목록에서 삭제했어요."),
        onError: error => toastError(error, "삭제에 실패했어요."),
      });
      return;
    }

    // 다시 초대는 전용 API가 없다. 같은 invite에 그 주소를 다시 넣으면 재발송된다
    invite(
      { emails: [member.email] },
      {
        onSuccess: response => {
          if (response.failed_items.length > 0) {
            Toast.error(response.failed_items[0].reason);
            return;
          }
          Toast.success(`${member.email} 로 초대를 다시 보냈어요.`);
        },
        onError: error => toastError(error, "초대 재발송에 실패했어요."),
      },
    );
  };

  const handleConfirm = () => {
    if (!confirm) {
      return;
    }

    const { kind, member } = confirm;

    if (kind === "changeGrade") {
      updateGrade(
        { memberId: member.id, grade: "관리자" },
        {
          onSuccess: () => {
            setConfirm(null);
            Toast.success(`${member.name ?? member.email}님을 관리자로 전환했어요.`);
          },
          onError: error => toastError(error, "권한 변경에 실패했어요."),
        },
      );
      return;
    }

    updateStatus(
      { memberId: member.id, status: "강제탈퇴" },
      {
        onSuccess: () => {
          setConfirm(null);
          Toast.success(`${member.name ?? member.email}님을 내보냈어요.`);
        },
        onError: error => toastError(error, "내보내기에 실패했어요."),
      },
    );
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
              {/* 이름 변경과 삭제는 관리자만 할 수 있다. 서버가 막더라도 버튼이 보이면
                  눌러보고 에러를 받게 되므로 아예 그리지 않는다 */}
              {isAdmin && (
                <WorkspaceNameSection name={workspaceName} isPending={isUpdatingName} onSubmit={handleUpdateName} />
              )}

              <MemberSection
                members={members}
                isLoading={isMembersLoading}
                canInvite={isAdmin}
                renderMenu={member =>
                  canManageMember(member) ? (
                    <MemberRowMenu member={member} disabled={isMemberActionPending} onSelect={handleMemberAction} />
                  ) : null
                }
                onInvite={() => setIsInviteModalOpen(true)}
              />

              {isAdmin && <DeleteWorkspaceSection onRequestDelete={() => setIsDeleteModalOpen(true)} />}
            </div>
          )}

          <MemberConfirmModal
            kind={confirm?.kind ?? null}
            member={confirm?.member ?? null}
            isPending={isUpdatingGrade || isUpdatingStatus}
            onOpenChange={open => !open && setConfirm(null)}
            onConfirm={handleConfirm}
          />

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
