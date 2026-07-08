"use client";

import {
  BarChart3,
  FileText,
  LayoutDashboard,
  MapPin,
  PanelLeft,
  Search,
  Settings,
  Store,
  User,
  Users,
} from "lucide-react";

import { useUserSettingsStore } from "@stores/useUserSettingsStore";

import { cn } from "@utils/shadcn";

// 섹션 → 항목 (계층 없는 단일 버튼 리스트)
const NAV_SECTIONS = [
  {
    label: "메인",
    items: [
      { icon: LayoutDashboard, label: "대시보드" },
      { icon: Store, label: "브랜드 정보 설정" },
      { icon: FileText, label: "브랜드 문서 작성" },
      { icon: Search, label: "바이어 탐색", badge: 3 },
      { icon: BarChart3, label: "진행 관리" },
      { icon: MapPin, label: "AI 상권분석" },
    ],
  },
  {
    label: "관리",
    items: [
      { icon: User, label: "내 정보 관리" },
      { icon: Users, label: "워크스페이스 관리" },
    ],
  },
];

export default function GlobalSideNav() {
  const collapsed = useUserSettingsStore(state => state.sidebarCollapsed);
  const toggle = useUserSettingsStore(state => state.toggleSidebar);

  return (
    <nav className="bg-background flex h-full flex-col">
      {/* ① 상단: 워크스페이스 + 토글 (고정) */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 px-3 py-4",
          collapsed ? "flex-col items-center gap-3" : "items-center gap-2",
        )}
      >
        <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
          E
        </div>
        {!collapsed && <span className="text-text-primary flex-1 truncate font-bold tracking-tight">EATIQ LINK</span>}
        <button onClick={toggle} className="hover:bg-accent rounded-md p-1.5" aria-label="사이드바 토글">
          <PanelLeft className="text-text-secondary size-4" />
        </button>
      </div>

      {/* ② 메뉴: 섹션 그룹 (스크롤 영역) */}
      <div className="flex-1 space-y-4 overflow-y-auto px-2 py-2">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="space-y-1">
            <p
              className={cn(
                "text-text-tertiary truncate px-2.5 py-1 text-xs font-semibold transition-opacity",
                collapsed && "opacity-0",
              )}
            >
              {section.label}
            </p>
            {section.items.map(item => (
              <button
                key={item.label}
                className={cn(
                  "text-text-secondary hover:bg-accent flex w-full items-center rounded-lg py-2 text-sm transition-[padding] duration-300 ease-in-out",
                  collapsed ? "px-[15px]" : "px-2.5",
                )}
              >
                <item.icon className="size-4.5 shrink-0" />
                <span
                  className={cn(
                    "truncate text-left transition-all duration-300 ease-in-out",
                    collapsed ? "ml-0 max-w-0 opacity-0" : "ml-3 max-w-[180px] flex-1 opacity-100",
                  )}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={cn(
                      "text-text-tertiary shrink-0 overflow-hidden text-xs transition-all duration-300 ease-in-out",
                      collapsed ? "ml-0 max-w-0 opacity-0" : "ml-auto max-w-[40px] opacity-100",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* ③ 하단: 액션 + 유저 (고정) */}
      <div className="border-border shrink-0 space-y-1 border-t p-2">
        <button
          className={cn(
            "text-text-secondary hover:bg-accent flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm",
            collapsed && "justify-center",
          )}
        >
          <Settings className="size-4.5 shrink-0" />
          {!collapsed && <span>설정</span>}
        </button>
        <div className={cn("flex items-center gap-2 px-1.5 py-1.5", collapsed && "justify-center")}>
          <div className="bg-primary-light text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            몽
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-text-primary truncate text-sm font-semibold">몽탄</p>
              <p className="text-text-tertiary truncate text-xs">dev_front@eatiq.io</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
