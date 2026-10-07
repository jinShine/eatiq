"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";

import { cn } from "@utils/shadcn";

export const SETTINGS_TABS = [
  { key: "basic", label: "기본 정보" },
  { key: "visual", label: "브랜드 비주얼" },
  { key: "policy", label: "계약 및 정책" },
  { key: "area", label: "상권분석 기준" },
] as const;
export type SettingsTabKey = (typeof SETTINGS_TABS)[number]["key"];

type SettingsTabNavProps = {
  workspaceId: string;
  activeTab: SettingsTabKey;
};

export default function SettingsTabNav({ workspaceId, activeTab }: SettingsTabNavProps) {
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  // 좁은 화면에서 탭 메뉴가 가로 스크롤될 때, 선택된 탭이 가려져 있으면 보이는 곳으로 당긴다.
  // block: "nearest"라 페이지 세로 스크롤은 건드리지 않는다
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [activeTab]);

  return (
    // 탭 이름은 줄바꿈하지 않고, 한 줄에 안 들어가면 탭 메뉴만 가로 스크롤한다(스크롤바는 숨김)
    <nav className="border-border flex gap-1 overflow-x-auto border-b px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {SETTINGS_TABS.map(tab => {
        const isActive = tab.key === activeTab;
        return (
          <Link
            key={tab.key}
            ref={isActive ? activeTabRef : undefined}
            href={`/${workspaceId}/company-settings?tab=${tab.key}`}
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
