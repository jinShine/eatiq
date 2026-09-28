"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Toast } from "@components/ui";

import {
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceNameMutation,
  useWorkspaceDetail,
} from "@services/api/workspace/workspace.query";

import ROUTES from "@constants/routes";

import DeleteWorkspaceModal from "../_components/DeleteWorkspaceModal";
import DeleteWorkspaceSection from "../_components/DeleteWorkspaceSection";
import WorkspaceNameSection, { type WorkspaceNameForm } from "../_components/WorkspaceNameSection";

export default function WorkspacesSettingsContainer({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading } = useWorkspaceDetail(workspaceId);
  const { mutate: updateName, isPending: isUpdatingName } = useUpdateWorkspaceNameMutation(workspaceId);
  const { mutate: removeWorkspace, isPending: isDeleting } = useDeleteWorkspaceMutation(workspaceId);

  const workspaceName = data?.workspace.name ?? "";

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

              <DeleteWorkspaceSection onRequestDelete={() => setIsDeleteModalOpen(true)} />
            </div>
          )}

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
