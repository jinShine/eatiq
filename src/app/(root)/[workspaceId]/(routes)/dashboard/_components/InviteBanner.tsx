"use client";

import dayjs from "dayjs";
import { Mail } from "lucide-react";

import { Button, Toast } from "@components/ui";

import { useInvitedWorkspaces, useRespondInviteMutation } from "@services/api/workspace/workspace.query";

/**
 * 받은 워크스페이스 초대 (피그마 64:255) — 받은 초대가 있을 때만 맨 위에 보인다.
 * 시안의 「초대한 사람(이름·메일)」은 API가 주지 않아 받은 날짜만 보여준다(백엔드 요청).
 */
export default function InviteBanner() {
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
                Toast.success(action === "수락" ? "워크스페이스에 참여했어요." : "초대를 거절했어요.", {
                  description: invite.name,
                }),
              onError: error => Toast.error(error.message),
            },
          );

        return (
          <li
            key={invite.id}
            className="border-border flex flex-col gap-3 rounded-xl border bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="bg-primary-background text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
                <Mail className="size-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-text-primary truncate text-sm font-bold tracking-[-0.7px]">
                  {invite.name} 워크스페이스 초대
                </p>
                {invite.invitedAt && (
                  <p className="text-text-tertiary text-xs">
                    {dayjs(invite.invitedAt).format("YYYY.MM.DD")}에 초대받았어요
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" disabled={isResponding} onClick={() => handleRespond("거절")}>
                거절
              </Button>
              <Button size="sm" disabled={isResponding} onClick={() => handleRespond("수락")}>
                수락
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
