"use client";

import { useState } from "react";

import { BarChart3, FileText, LayoutDashboard, MapPin, PanelLeft, Search, Store, User, Users } from "lucide-react";

import { useUserSettingsStore } from "@stores/useUserSettingsStore";

import { cn } from "@utils/shadcn";

import SidebarNavItem from "./_components/SidebarNavItem";
import SidebarUserProfile from "./_components/SidebarUserProfile";
import WorkspaceSwitcher from "./_components/WorkspaceSwitcher";

// 임시 목업 — 데이터 레이어(brands.query) 연결 전까지 UI 확인용
const MOCK_WORKSPACES = [
  { id: "ws-1", name: "몽탄" },
  { id: "ws-2", name: "롤링파스타" },
  { id: "ws-3", name: "고든램지버거" },
];

// 임시 목업 — 추후 useMe() 등 데이터 레이어로 대체
const MOCK_USER = { name: "몽탄", email: "dev_front@eatiq.io" };

// 섹션 → 항목 (계층 없는 단일 버튼 리스트)
const NAV_SECTIONS = [
  {
    label: "메인",
    items: [
      { icon: LayoutDashboard, label: "대시보드" },
      { icon: Store, label: "브랜드 정보 설정" },
      { icon: FileText, label: "브랜드 문서 작성" },
      { icon: Search, label: "바이어 탐색" },
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

  // 임시 상태 — 추후 URL의 workspaceId + router.push로 대체
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(MOCK_WORKSPACES[0].id);

  // 임시 상태 — 추후 usePathname()으로 현재 라우트와 비교해 대체
  const [activeItem, setActiveItem] = useState("대시보드");

  return (
    <nav className="flex h-full flex-col bg-[#111827]">
      {/* ① 상단: 워크스페이스 스위처 + 토글 (고정) — 헤더 껍데기는 부모가 소유 */}
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-white/[0.18]",
          collapsed ? "h-auto flex-col gap-2 py-2" : "h-16 gap-2 px-3",
        )}
      >
        <WorkspaceSwitcher
          workspaces={MOCK_WORKSPACES}
          currentId={currentWorkspaceId}
          onSwitch={setCurrentWorkspaceId}
          collapsed={collapsed}
        />
        <button
          onClick={toggle}
          aria-label="사이드바 토글"
          className={cn(
            "flex items-center justify-center rounded-lg text-white/60 hover:bg-white/10",
            collapsed ? "size-9" : "ml-auto p-1.5",
          )}
        >
          <PanelLeft className="size-4" />
        </button>
      </div>

      {/* ② 메뉴: 섹션 그룹 (스크롤 영역) */}
      <div className="flex-1 space-y-4 overflow-y-auto px-2 py-2">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="space-y-1">
            <p
              className={cn(
                "truncate px-2.5 py-1 text-xs font-semibold text-[#9a9aa6] transition-opacity",
                collapsed && "opacity-0",
              )}
            >
              {section.label}
            </p>
            {section.items.map(item => (
              <SidebarNavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                active={activeItem === item.label}
                onClick={() => setActiveItem(item.label)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ③ 하단: 유저 프로필 (고정) */}
      <div className="shrink-0 border-t border-white/10 p-2">
        <SidebarUserProfile user={MOCK_USER} collapsed={collapsed} />
      </div>
    </nav>
  );
}
