"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

type RecordDeleteModalProps = {
  /** 지울 기록의 제목. null이면 닫힘 */
  title: string | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

/** 진행 기록 삭제 확인. 피그마에 없어 진행 관리 삭제 모달과 같은 구성으로 둔다 */
export default function RecordDeleteModal({ title, isPending, onOpenChange, onConfirm }: RecordDeleteModalProps) {
  return (
    <Modal isOpen={title !== null} onOpenChange={onOpenChange} className="w-full sm:max-w-[520px]">
      <ModalHeader>진행 기록 삭제</ModalHeader>
      <ModalBody>
        <p className="text-text-primary text-sm font-bold">{title}</p>
        <p className="text-text-secondary text-sm leading-relaxed">이 기록을 삭제할까요? 삭제하면 되돌릴 수 없어요.</p>
      </ModalBody>
      <ModalFooter className="border-border border-t pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
          취소
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
          {isPending ? "삭제 중…" : "삭제"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
