"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

type MenuRemoveModalProps = {
  /** 지울 메뉴의 탭 이름. null이면 닫힘 */
  label: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

/**
 * 메뉴 삭제 확인. 피그마에 없어 파일 삭제 모달(MediaRemoveModal)과 같은 구성으로 둔다.
 * 지운 메뉴는 저장을 눌러야 서버에서도 빠진다 — 입력한 내용을 한 번에 잃으니 한 번 묻는다.
 */
export default function MenuRemoveModal({ label, onOpenChange, onConfirm }: MenuRemoveModalProps) {
  return (
    <Modal isOpen={label !== null} onOpenChange={onOpenChange} className="w-full sm:max-w-[520px]">
      <ModalHeader>메뉴 삭제</ModalHeader>
      <ModalBody>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-text-primary font-bold">{label}</span> 메뉴를 지울까요?
          <br />
          입력한 내용이 사라지고, 저장을 누르면 반영돼요.
        </p>
      </ModalBody>
      <ModalFooter className="border-border border-t pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          삭제
        </Button>
      </ModalFooter>
    </Modal>
  );
}
