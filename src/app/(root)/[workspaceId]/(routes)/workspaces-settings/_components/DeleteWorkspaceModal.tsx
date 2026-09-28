"use client";

import { useEffect, useState } from "react";

import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

type DeleteWorkspaceModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** 삭제를 확정하려면 사용자가 이 이름을 그대로 입력해야 한다 */
  workspaceName: string;
  isPending?: boolean;
  onConfirm: () => void;
};

/**
 * 워크스페이스 삭제 확인.
 *
 * 이름을 그대로 받아 적게 한다. 되돌릴 수 없는 삭제에서 "정말 삭제하시겠습니까?"에
 * 예를 누르는 건 습관으로 통과되지만, 이름을 옮겨 적는 동안에는 무엇을 지우는지 읽게 된다.
 */
export default function DeleteWorkspaceModal({
  isOpen,
  onOpenChange,
  workspaceName,
  isPending,
  onConfirm,
}: DeleteWorkspaceModalProps) {
  const [confirmText, setConfirmText] = useState("");

  // 닫을 때마다 비운다. 다시 열었을 때 이미 통과된 상태로 시작하면 안 된다
  useEffect(() => {
    if (!isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  const canDelete = confirmText.trim() === workspaceName.trim();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full sm:max-w-[520px]">
      <ModalHeader>워크스페이스 삭제</ModalHeader>

      <ModalBody className="gap-5">
        <p className="text-text-secondary text-sm leading-relaxed">
          워크스페이스를 삭제하면
          <br />
          모든 데이터가 사라지며 복구할 수 없습니다.
        </p>

        <div className="flex flex-col gap-2">
          <label htmlFor="delete-confirm" className="text-text-secondary text-sm">
            삭제하려면 워크스페이스의 이름(<span className="text-text-primary font-bold">{workspaceName}</span>)을
            입력하세요
          </label>
          <Input
            id="delete-confirm"
            autoComplete="off"
            placeholder="워크스페이스의 이름을 입력해주세요"
            value={confirmText}
            onChange={event => setConfirmText(event.target.value)}
          />
        </div>
      </ModalBody>

      <ModalFooter className="border-border border-t pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button variant="destructive" disabled={!canDelete} isLoading={isPending} onClick={onConfirm}>
          워크스페이스 삭제
        </Button>
      </ModalFooter>
    </Modal>
  );
}
