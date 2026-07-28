"use client";

import { useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import { useWorkspaces } from "@services/api/brand/brand.query";

export default function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: workspaces, isLoading } = useWorkspaces();

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

  if (isLoading || !isMember) {
    return null; // TODO: 풀페이지 로더
  }

  return <>{children}</>;
}
