"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";

import { cn } from "@utils/shadcn";

import { DOCUMENTS_TABS, type DocumentsTabKey } from "./documentsTabs";

type DocumentsTabNavProps = {
  workspaceId: string;
  activeTab: DocumentsTabKey;
};

export default function DocumentsTabNav({ workspaceId, activeTab }: DocumentsTabNavProps) {
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  // 좁은 화면에서 가로 스크롤될 때 선택된 탭이 가려져 있으면 보이는 곳으로 당긴다
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [activeTab]);

  return (
    // 회사 정보 설정 탭(SettingsTabNav)과 같은 모양
    <nav className="border-border flex gap-1 overflow-x-auto border-b px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {DOCUMENTS_TABS.map(tab => {
        const isActive = tab.key === activeTab;
        return (
          <Link
            key={tab.key}
            ref={isActive ? activeTabRef : undefined}
            href={`/${workspaceId}/brand-documents?tab=${tab.key}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "shrink-0 border-b-2 px-2 py-5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "border-primary text-text-primary"
                : "border-transparent text-text-tertiary hover:text-text-secondary",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
