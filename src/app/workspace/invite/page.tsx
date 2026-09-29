import { use } from "react";

import InviteContainer from "./_container";

type Props = {
  /** 백엔드가 보내는 초대 메일 링크의 쿼리 — /workspace/invite?workspace_uid=1&email=... */
  searchParams: Promise<{ workspace_uid?: string; email?: string }>;
};

export default function WorkspaceInvitePage({ searchParams }: Props) {
  const { workspace_uid: workspaceId, email } = use(searchParams);

  return <InviteContainer workspaceId={workspaceId ?? ""} email={email ?? ""} />;
}
