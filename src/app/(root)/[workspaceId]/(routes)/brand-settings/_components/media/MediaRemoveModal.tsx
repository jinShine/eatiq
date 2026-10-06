"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

type MediaRemoveModalProps = {
  /** 지울 파일이 속한 항목 이름 — "브랜드 로고" 등. null이면 닫힘 */
  label: string | null;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

/**
 * 업로드한 파일 삭제 확인. 비주얼 카드는 저장 버튼 없이 바로 저장돼서, 실수로 지우지 않게 한 번 묻는다.
 * 구성은 워크스페이스 설정의 확인 모달(MemberConfirmModal)과 같다 — 제목, 안내, 취소/실행.
 */
export default function MediaRemoveModal({ label, isPending, onOpenChange, onConfirm }: MediaRemoveModalProps) {
  return (
    <Modal isOpen={label !== null} onOpenChange={onOpenChange} className="w-full sm:max-w-[520px]">
      <ModalHeader>파일 삭제</ModalHeader>
      <ModalBody>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-text-primary font-bold">{label}</span>에서 이 파일을 지울까요?
          <br />
          지운 파일은 되돌릴 수 없어요.
        </p>
      </ModalBody>
      <ModalFooter className="border-border border-t pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button variant="destructive" isLoading={isPending} onClick={onConfirm}>
          삭제
        </Button>
      </ModalFooter>
    </Modal>
  );
}
