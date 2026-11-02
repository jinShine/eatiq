"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

type WithdrawWorkspaceModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceName?: string;
  /** 나 말고 남은 멤버가 없다 — 서버가 워크스페이스까지 함께 지운다 */
  isLastMember: boolean;
  isPending?: boolean;
  onConfirm: () => void;
};

/** 워크스페이스 탈퇴 확인 (피그마 693:2832) */
export default function WithdrawWorkspaceModal({
  isOpen,
  onOpenChange,
  workspaceName,
  isLastMember,
  isPending,
  onConfirm,
}: WithdrawWorkspaceModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full sm:max-w-[520px]">
      <ModalHeader>워크스페이스 탈퇴</ModalHeader>

      <ModalBody className="gap-3">
        <p className="text-text-secondary text-sm leading-relaxed break-keep">
          {workspaceName ? (
            <>
              <span className="text-text-primary font-bold">‘{workspaceName}’</span> 워크스페이스에서 나가시겠습니까?
            </>
          ) : (
            "이 워크스페이스에서 나가시겠습니까?"
          )}
          <br />
          다른 워크스페이스의 참여엔 영향을 끼치지 않습니다.
        </p>

        {/* 시안에 없는 경우. 혼자 남은 관리자가 나가면 데이터가 모두 지워지는데 위 문구만으론 알 수 없다 */}
        {isLastMember && (
          <p className="text-destructive bg-destructive/5 rounded-lg px-3 py-2.5 text-sm leading-relaxed font-semibold break-keep">
            이 워크스페이스에 남은 멤버가 없어 탈퇴하면 워크스페이스와 모든 데이터가 함께 삭제되며 복구할 수 없습니다.
          </p>
        )}
      </ModalBody>

      <ModalFooter className="border-border border-t pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button variant="destructive" isLoading={isPending} onClick={onConfirm}>
          네, 나가겠습니다
        </Button>
      </ModalFooter>
    </Modal>
  );
}
