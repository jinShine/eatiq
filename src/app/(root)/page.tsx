"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useMe } from "@services/api/auth/auth.query";
import { useWorkspaces } from "@services/api/brand/brand.query";

export default function RootPage() {
  const router = useRouter();
  const { data: me, isLoading: meLoading } = useMe();
  const { data: workspaces, isLoading: wsLoading } = useWorkspaces();

  const isLoading = meLoading || wsLoading;
  // 우선순위: 마지막 워크스페이스 → 목록 첫 번째
  const targetId = me?.user?.lastBrandId ?? workspaces?.[0]?.id;

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
