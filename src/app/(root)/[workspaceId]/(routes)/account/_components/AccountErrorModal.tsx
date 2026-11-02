"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

export type AccountError = { title: string; message: string };

type AccountErrorModalProps = {
  error: AccountError | null;
  onClose: () => void;
};

/**
 * 탈퇴·삭제가 거절됐을 때 (피그마 693:2915 「워크스페이스 탈퇴 실패」).
 * 토스트로 띄우면 금방 사라지는데, 거절 사유가 "권한을 넘기고 다시 시도"처럼 해야 할 일이라 읽을 시간이 필요하다
 */
export default function AccountErrorModal({ error, onClose }: AccountErrorModalProps) {
  return (
    <Modal isOpen={error !== null} onOpenChange={open => !open && onClose()} className="w-full sm:max-w-[520px]">
      <ModalHeader>{error?.title}</ModalHeader>

      <ModalBody>
        {/* 서버 문구가 시안 문구보다 정확하다 — 실제 거절 조건을 그대로 말해준다 */}
        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line break-keep">{error?.message}</p>
      </ModalBody>

      <ModalFooter className="border-border border-t pt-4">
        <Button onClick={onClose}>확인</Button>
      </ModalFooter>
    </Modal>
  );
}
