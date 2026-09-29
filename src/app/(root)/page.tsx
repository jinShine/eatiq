"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useInvitedWorkspaces, useMyWorkspaces } from "@services/api/workspace/workspace.query";

import WorkspaceEmptyState from "./_components/WorkspaceEmptyState";

export default function RootPage() {
  const router = useRouter();
  const { data: workspaces, isLoading } = useMyWorkspaces();

  // 새 백엔드에는 마지막 워크스페이스(lastBrandId) 개념이 없어 목록 첫 번째로 보낸다.
  // TODO(API): 마지막 접속 워크스페이스를 기억하는 필드가 생기면 그것을 우선한다.
  const targetId = workspaces?.[0]?.id;

  // 워크스페이스가 없을 때만 필요하다. 있으면 바로 대시보드로 가므로 부르지 않는다
  const hasNoWorkspace = !isLoading && !targetId;
  const { data: invites = [], isLoading: isInvitesLoading } = useInvitedWorkspaces(hasNoWorkspace);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (targetId) {
      router.replace(`/${targetId}/dashboard`);
    }
  }, [isLoading, targetId, router]);

  // 초대 목록까지 기다린다. 생성 화면이 먼저 떴다가 초대 목록으로 바뀌면 화면이 튄다
  if (isLoading || (hasNoWorkspace && isInvitesLoading)) {
    return null; // TODO: 풀페이지 로더
  }

  const goToDashboard = (workspaceId: string) => router.replace(`/${workspaceId}/dashboard`);

  // 워크스페이스가 하나도 없을 때 (온보딩 자리)
  if (!targetId) {
    return <WorkspaceEmptyState invites={invites} onCreated={goToDashboard} onAccepted={goToDashboard} />;
  }

  return null; // 리다이렉트 대기
}
