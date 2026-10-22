"use client";

import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import { Mail } from "lucide-react";

import { Button, Toast } from "@components/ui";

import { useInvitedWorkspaces, useRespondInviteMutation } from "@services/api/workspace/workspace.query";
import { type InvitedWorkspace } from "@services/api/workspace/workspace.type";

/**
 * 받은 워크스페이스 초대 (피그마 64:255) — 받은 초대가 있을 때만 맨 위에 보인다.
 * 시안에 없는 왼쪽 메일 아이콘은 사용자 요청으로 더했다(2026-10-19).
 * 초대한 사람(이름·메일)은 서버가 2026-10-22부터 준다.
 * 수락해도 지금 워크스페이스에 머물고, 토스트의 「이동」으로 원할 때 옮겨 간다.
 */
/**
 * 시안 문구: 「민서 (minseo@eatiq.io)님이 2026.07.05에 초대했습니다.」
 * 초대한 사람·날짜 중 없는 것은 빼고 만든다 — 둘 다 없으면 문구를 그리지 않는다
 */
const inviteMessage = ({ inviter, invitedAt }: InvitedWorkspace) => {
  const who = inviter?.name
    ? inviter.email
      ? `${inviter.name} (${inviter.email})님이`
      : `${inviter.name}님이`
    : inviter?.email
      ? `${inviter.email}님이`
      : "";
  const when = invitedAt ? `${dayjs(invitedAt).format("YYYY.MM.DD")}에` : "";
  if (!who && !when) {
    return null;
  }
  return `${[who, when].filter(Boolean).join(" ")} 초대했습니다.`;
};

/** 「이동」 버튼이 있는 토스트를 띄워 두는 시간 */
const ACTION_TOAST_MS = 8000;

export default function InviteBanner() {
  const router = useRouter();
  const { data: invites = [] } = useInvitedWorkspaces();
  const { mutate: respond, isPending, variables } = useRespondInviteMutation();

  if (invites.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-2">
      {invites.map(invite => {
        const isResponding = isPending && variables?.workspaceId === invite.id;
        const handleRespond = (action: "수락" | "거절") =>
          respond(
            { workspaceId: invite.id, action },
            {
              onSuccess: () =>
                action === "수락"
                  ? Toast.success("워크스페이스에 참여했어요.", {
                      description: invite.name,
                      action: { label: "이동", onClick: () => router.push(`/${invite.id}/dashboard`) },
                      // 버튼을 누를 틈을 준다 — 기본(4초)은 읽고 누르기에 짧다
                      duration: ACTION_TOAST_MS,
                    })
                  : Toast.success("초대를 거절했어요.", { description: invite.name }),
              onError: error => Toast.error(error.message),
            },
          );

        return (
          <li
            key={invite.id}
            className="bg-primary-50 flex flex-col gap-4 rounded-xl p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="text-primary flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
                <Mail className="size-5" aria-hidden />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate text-lg font-bold tracking-[-0.9px] text-[#1d1d1f]">
                  {invite.name} 워크스페이스 초대
                </p>
                {inviteMessage(invite) && (
                  <p className="text-sm font-medium tracking-[-0.7px] text-[#6b7280]">{inviteMessage(invite)}</p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                className="h-auto bg-white px-[18px] py-[9px] text-[13px] font-semibold"
                disabled={isResponding}
                onClick={() => handleRespond("거절")}
              >
                거절
              </Button>
              <Button
                className="h-auto px-[18px] py-[9px] text-[13px] font-semibold"
                disabled={isResponding}
                onClick={() => handleRespond("수락")}
              >
                수락
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
