"use client";

import { useParams } from "next/navigation";

import { useCurrentWorkspace } from "@services/api/workspace/workspace.query";

import AiAskButton from "./AiAskButton";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspace = useCurrentWorkspace(workspaceId);

  return (
    <header className="bg-background sticky top-0 z-30 flex min-h-16 shrink-0 items-center justify-between gap-4 border-b px-6 py-3">
      {/* 좌: 제목 위 / 부제 아래 (세로 스택 — 좁은 화면에서 우측 액션과 충돌 방지) */}
      <div className="flex min-w-0 flex-col">
        <h1 className="text-text-primary text-lg font-bold tracking-tight">{title}</h1>
        {/* 모바일은 두 줄까지, 데스크톱은 한 줄 말줄임 */}
        {description && (
          <p className="text-text-tertiary line-clamp-2 text-xs md:line-clamp-none md:truncate">{description}</p>
        )}
      </div>

      {/* 우: AI 도우미 (기본 내장 — 페이지마다 주입하지 않음. 추후 모달 트리거).
          브랜드 워크스페이스에만 있다(피그마 「브랜드 / 바이어 차이점」). 종류를 알기 전에는 그리지 않는다 —
          바이어에서 버튼이 잠깐 보였다 사라지지 않게 */}
      {workspace?.type === "brand" && <AiAskButton />}
    </header>
  );
}
