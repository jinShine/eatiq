"use client";

import { Modal, ModalBody, ModalHeader } from "@components/ui";

import { type InvitedWorkspace } from "@services/api/workspace/workspace.type";

import InvitedWorkspaceList from "./InvitedWorkspaceList";

type ReceivedInvitesModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invites: InvitedWorkspace[];
  onAccepted: (workspaceId: string) => void;
};

/**
 * 사이드바의 「받은 초대」.
 *
 * 이미 워크스페이스가 있는 사람은 루트를 거치지 않고 바로 대시보드로 가서,
 * 새로 받은 초대를 볼 곳이 없었다. 빈 화면과 같은 목록을 모달로 띄운다.
 */
export default function ReceivedInvitesModal({ isOpen, onOpenChange, invites, onAccepted }: ReceivedInvitesModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full sm:max-w-[520px]">
      <ModalHeader>받은 초대</ModalHeader>

      <ModalBody>
        {invites.length > 0 ? (
          <InvitedWorkspaceList invites={invites} onAccepted={onAccepted} />
        ) : (
          // 마지막 초대를 처리하면 목록이 비는데, 모달이 텅 비어 보이지 않게 한 줄 남긴다
          <p className="text-text-tertiary py-6 text-center text-sm">남은 초대가 없어요.</p>
        )}
      </ModalBody>
    </Modal>
  );
}
