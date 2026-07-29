"use client";

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
  return (
    <nav className="border-border flex gap-1 border-b px-5">
      {SETTINGS_TABS.map(tab => {
        const isActive = tab.key === activeTab;
        return (
          <Link
            key={tab.key}
            href={`/${workspaceId}/brand-settings?tab=${tab.key}`}
            className={cn(
              "border-b-2 px-2 py-5 text-sm font-medium transition-colors",
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
