"use client";

import { useEffect, useState } from "react";

import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

const CONFIRM_WORD = "삭제합니다";

type DeleteAccountModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  onConfirm: () => void;
};

/**
 * 계정 삭제 확인 (피그마 693:2849).
 * 워크스페이스 삭제처럼 문구를 옮겨 적게 해 습관적으로 누르고 지나가지 않게 한다
 */
export default function DeleteAccountModal({ isOpen, onOpenChange, isPending, onConfirm }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("");

  // 닫을 때마다 비운다. 다시 열었을 때 이미 통과된 상태로 시작하면 안 된다
  useEffect(() => {
    if (!isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  const canDelete = confirmText.trim() === CONFIRM_WORD;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full sm:max-w-[520px]">
      <ModalHeader>계정 삭제</ModalHeader>

      <ModalBody className="gap-5">
        <p className="text-text-secondary text-sm leading-relaxed break-keep">
          계정을 삭제하시겠습니까?
          <br />
          모든 워크스페이스에서 계정이 사라집니다.
          {/* 시안에 없는 문구. 서버가 혼자 속한 워크스페이스를 함께 지운다 */}
          <br />
          혼자 속한 워크스페이스는 함께 삭제됩니다.
        </p>

        <div className="flex flex-col gap-2">
          <label htmlFor="delete-account-confirm" className="text-text-secondary text-sm">
            계정 삭제를 위해선 아래에 ‘<span className="text-text-primary font-bold">{CONFIRM_WORD}</span>’를
            입력해주세요.
          </label>
          <Input
            id="delete-account-confirm"
            autoComplete="off"
            placeholder={CONFIRM_WORD}
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
          네, 삭제합니다
        </Button>
      </ModalFooter>
    </Modal>
  );
}
