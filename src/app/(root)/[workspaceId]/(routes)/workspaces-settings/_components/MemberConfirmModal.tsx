"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

import { type WorkspaceMember } from "@services/api/workspace/workspace.type";

export type MemberConfirmKind = "promote" | "demote" | "remove";

/**
 * 확인 모달 문구 (피그마 node 693:3343 · 693:3360 · 사용자로 변경은 피그마에 없음).
 *
 * 한 컴포넌트로 묶은 이유는 구조가 같아서다 — 제목, 이름이 박힌 안내, 취소/실행.
 * 문구만 다른 모달을 둘로 나누면 여백과 버튼 톤이 갈라진다.
 */
const CONFIRM_CONTENT: Record<
  MemberConfirmKind,
  { title: string; confirmLabel: string; isDestructive: boolean; describe: (name: string) => React.ReactNode }
> = {
  promote: {
    title: "관리자로 전환",
    confirmLabel: "네, 전환합니다",
    isDestructive: false,
    // 피그마 문구의 "현재 관리자의 권한은 '사용자'로 변경됩니다"는 뺐다.
    // 서버는 기존 관리자를 강등하지 않는다(실측) — 문구가 실제 동작과 달라진다
    describe: name => (
      <>
        <span className="text-text-primary font-bold">“{name}”</span>님에게 관리자 권한을 주시겠습니까?
        <br />
        관리자는 사용자의 초대와 내보내기, 워크스페이스 설정을 변경할 수 있습니다.
      </>
    ),
  },
  demote: {
    title: "사용자로 변경",
    confirmLabel: "사용자로 변경",
    isDestructive: true,
    describe: name => (
      <>
        <span className="text-text-primary font-bold">“{name}”</span>님의 관리자 권한을 해제하시겠습니까?
        <br />
        사용자는 초대·내보내기와 워크스페이스 설정을 할 수 없습니다.
      </>
    ),
  },
  remove: {
    title: "사용자 내보내기",
    confirmLabel: "내보내기",
    isDestructive: true,
    describe: name => (
      <>
        <span className="text-text-primary font-bold">“{name}”</span>님을 내보내시겠습니까?
        <br />
        해당 사용자가 워크스페이스를 이용하기 위해선 다시 초대 받아야 합니다.
      </>
    ),
  },
};

type MemberConfirmModalProps = {
  kind: MemberConfirmKind | null;
  member: WorkspaceMember | null;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function MemberConfirmModal({
  kind,
  member,
  isPending,
  onOpenChange,
  onConfirm,
}: MemberConfirmModalProps) {
  // 닫히는 애니메이션 동안 kind가 비어도 내용이 사라지지 않도록 마지막 값을 쓴다
  const content = kind ? CONFIRM_CONTENT[kind] : null;

  return (
    <Modal isOpen={Boolean(kind && member)} onOpenChange={onOpenChange} className="w-full sm:max-w-[520px]">
      <ModalHeader>{content?.title ?? ""}</ModalHeader>

      <ModalBody>
        <p className="text-text-secondary text-sm leading-relaxed">
          {content?.describe(member?.name ?? member?.email ?? "")}
        </p>
      </ModalBody>

      <ModalFooter className="border-border border-t pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button variant={content?.isDestructive ? "destructive" : "default"} isLoading={isPending} onClick={onConfirm}>
          {content?.confirmLabel ?? ""}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
