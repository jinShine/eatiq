"use client";

import { useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import { useMyWorkspaces } from "@services/api/workspace/workspace.query";

import WorkspaceSkeleton from "./WorkspaceSkeleton";

export default function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: workspaces, isLoading } = useMyWorkspaces();

  const isMember = workspaces?.some(w => w.id === workspaceId);

  useEffect(() => {
    if (isLoading || !workspaces) {
      return;
    }
    if (isMember) {
      return;
    }

    if (workspaces.length > 0) {
      router.replace(`/${workspaces[0].id}/dashboard`);
    } else {
      router.replace("/");
    }
  }, [isLoading, workspaces, isMember, router]);

  // 확인이 끝나기 전에 화면을 비우면 사이드바만 남고 본문이 깜빡인다.
  // 멤버가 아닌 경우도 위 effect가 곧 다른 곳으로 보내므로 같은 골격을 유지한다.
  if (isLoading || !isMember) {
    return <WorkspaceSkeleton />;
  }

  return <>{children}</>;
}
