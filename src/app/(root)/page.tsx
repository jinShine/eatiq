"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useMyWorkspaces } from "@services/api/workspace/workspace.query";

export default function RootPage() {
  const router = useRouter();
  const { data: workspaces, isLoading } = useMyWorkspaces();

  // 새 백엔드에는 마지막 워크스페이스(lastBrandId) 개념이 없어 목록 첫 번째로 보낸다.
  // TODO(API): 마지막 접속 워크스페이스를 기억하는 필드가 생기면 그것을 우선한다.
  const targetId = workspaces?.[0]?.id;

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (targetId) {
      router.replace(`/${targetId}/dashboard`);
    }
  }, [isLoading, targetId, router]);

  if (isLoading) {
    return null; // TODO: 풀페이지 로더
  }

  // 워크스페이스가 하나도 없을 때 (온보딩 자리)
  if (!targetId) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3">
        <p className="text-text-secondary text-sm">아직 워크스페이스가 없어요.</p>
        <p className="text-text-secondary text-sm font-bold">TODO: 워크스페이스 생성 플로우 필요!!!!!!!!</p>
        {/* TODO: 워크스페이스 생성 페이지/모달로 연결 */}
      </div>
    );
  }

  return null; // 리다이렉트 대기
}
