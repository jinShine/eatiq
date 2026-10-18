"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

type ProgressDeleteModalProps = {
  /** 지울 상대 이름. null이면 닫힘 */
  partnerName: string | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

/**
 * 관리 대상 삭제 확인. 피그마에 없어 메뉴 삭제 모달(MenuRemoveModal)과 같은 구성으로 둔다.
 * 딸린 진행 기록·다음 액션까지 함께 지워져 되돌릴 수 없으니 한 번 묻는다.
 */
export default function ProgressDeleteModal({
  partnerName,
  isPending,
  onOpenChange,
  onConfirm,
}: ProgressDeleteModalProps) {
  return (
    <Modal isOpen={partnerName !== null} onOpenChange={onOpenChange} className="w-full sm:max-w-[520px]">
      <ModalHeader>진행 관리 삭제</ModalHeader>
      <ModalBody>
        {/* 이름이 영문인 경우가 많아 조사(을/를)를 맞출 수 없다 — 조사가 필요 없는 문장으로 쓴다 */}
        <p className="text-text-primary text-sm font-bold">{partnerName}</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          진행 관리에서 삭제할까요?
          <br />
          지금까지의 진행 기록과 다음 액션도 함께 사라져요.
        </p>
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
