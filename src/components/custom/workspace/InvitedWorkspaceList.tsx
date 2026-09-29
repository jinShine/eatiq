"use client";

import { useState } from "react";

import dayjs from "dayjs";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Toast } from "@components/ui";

import { useRespondInviteMutation } from "@services/api/workspace/workspace.query";
import { type InvitedWorkspace } from "@services/api/workspace/workspace.type";

import { getInitial } from "@utils/functions";

const TYPE_LABEL: Record<InvitedWorkspace["type"], string> = {
  brand: "브랜드",
  buyer: "바이어",
};

type InvitedWorkspaceListProps = {
  invites: InvitedWorkspace[];
  /** 수락이 끝나면 그 워크스페이스 id를 넘긴다. 이동은 호출부가 정한다 */
  onAccepted: (workspaceId: string) => void;
};

/**
 * 받은 초대 목록 — 목록에서 바로 수락·거절한다.
 *
 * 워크스페이스가 없는 빈 화면과 사이드바의 「받은 초대」가 같은 목록을 쓴다.
 * 초대 메일을 거치지 않고 로그인한 사람도 여기서 초대를 받을 수 있다.
 *
 * 거절만 확인을 받는다. 거절은 되돌릴 수 없고(관리자가 다시 초대해야 한다),
 * 목록의 버튼은 초대 화면보다 가까이 붙어 있어 잘못 누르기 쉽다.
 */
export default function InvitedWorkspaceList({ invites, onAccepted }: InvitedWorkspaceListProps) {
  const { mutate: respond, isPending, variables } = useRespondInviteMutation();
  const [rejectTarget, setRejectTarget] = useState<InvitedWorkspace | null>(null);

  const handleAccept = (invite: InvitedWorkspace) => {
    respond(
      { workspaceId: invite.id, action: "수락" },
      {
        onSuccess: () => {
          Toast.success(`${invite.name} 워크스페이스에 참여했어요.`);
          onAccepted(invite.id);
        },
        onError: error => Toast.error(error.message || "초대 수락에 실패했어요."),
      },
    );
  };

  const handleReject = () => {
    if (!rejectTarget) {
      return;
    }

    respond(
      { workspaceId: rejectTarget.id, action: "거절" },
      {
        onSuccess: () => {
          Toast.success(`${rejectTarget.name} 초대를 거절했어요.`);
          setRejectTarget(null);
        },
        onError: error => Toast.error(error.message || "초대 거절에 실패했어요."),
      },
    );
  };

  return (
    <>
      <ul className="flex flex-col gap-2">
        {invites.map(invite => {
          // 한 번에 하나만 처리한다. 누른 행의 버튼에만 로딩을 보이고 나머지는 잠근다
          const isThisPending = isPending && variables?.workspaceId === invite.id;

          return (
            <li key={invite.id} className="border-border flex items-center gap-3 rounded-xl border bg-white px-4 py-3">
              <span className="bg-primary-50 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
                {getInitial(invite.name)}
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-text-primary truncate text-sm font-bold">{invite.name}</p>
                <p className="text-text-tertiary truncate text-xs">
                  {TYPE_LABEL[invite.type]}
                  {invite.invitedAt && ` · ${dayjs(invite.invitedAt).format("M월 D일")} 초대`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="sm" disabled={isPending} onClick={() => setRejectTarget(invite)}>
                  거절
                </Button>
                <Button
                  size="sm"
                  isLoading={isThisPending && variables?.action === "수락"}
                  disabled={isPending}
                  onClick={() => handleAccept(invite)}
                >
                  수락
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Modal
        isOpen={rejectTarget !== null}
        onOpenChange={open => !open && setRejectTarget(null)}
        className="w-full sm:max-w-[480px]"
      >
        <ModalHeader>초대 거절</ModalHeader>

        <ModalBody>
          <p className="text-text-secondary text-sm leading-relaxed">
            <span className="text-text-primary font-bold">“{rejectTarget?.name}”</span> 초대를 거절하시겠습니까?
            <br />
            거절하면 관리자가 다시 초대하기 전까지 참여할 수 없습니다.
          </p>
        </ModalBody>

        <ModalFooter className="border-border border-t pt-4">
          <Button variant="outline" onClick={() => setRejectTarget(null)}>
            취소
          </Button>
          <Button variant="destructive" isLoading={isPending} onClick={handleReject}>
            거절하기
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
