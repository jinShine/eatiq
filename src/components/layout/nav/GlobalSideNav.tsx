"use client";

import { useState, useTransition } from "react";

import { useParams, usePathname, useRouter } from "next/navigation";

import {
  BarChart3,
  Building2,
  Compass,
  FileText,
  LayoutDashboard,
  PanelLeft,
  Sparkles,
  Store,
  User,
  Users,
} from "lucide-react";

import { CreateWorkspaceModal } from "@components/custom/workspace";

import { useAuthUser, useLogoutMutation } from "@services/api/auth/auth.query";
import { useMyWorkspaces } from "@services/api/workspace/workspace.query";

import { useUserSettingsStore } from "@stores/useUserSettingsStore";

import { cn } from "@utils/shadcn";

import RouteProgressBar from "../RouteProgressBar";
import SidebarNavItem from "./_components/SidebarNavItem";
import SidebarUserProfile from "./_components/SidebarUserProfile";
import WorkspaceSwitcher from "./_components/WorkspaceSwitcher";

// 섹션 → 항목 (계층 없는 단일 버튼 리스트)
const NAV_SECTIONS = [
  {
    label: "",
    items: [
      { icon: LayoutDashboard, label: "대시보드", href: "dashboard" },
      { icon: Store, label: "브랜드 정보 설정", href: "brand-settings" },
      { icon: FileText, label: "브랜드 문서 작성", href: "brand-documents" },
      { icon: Users, label: "바이어 탐색", href: "buyer" },
      { icon: Compass, label: "브랜드 탐색", href: "brand" },
      { icon: BarChart3, label: "진행 관리", href: "progress" },
      { icon: Sparkles, label: "AI 상권분석", href: "market-analysis" },
    ],
  },
  {
    label: "관리",
    items: [
      { icon: User, label: "내 정보 설정", href: "account" },
      { icon: Building2, label: "워크스페이스 정보 설정", href: "workspaces-settings" },
    ],
  },
];

export default function GlobalSideNav() {
  const collapsed = useUserSettingsStore(state => state.sidebarCollapsed);
  const toggle = useUserSettingsStore(state => state.toggleSidebar);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isNavigating, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { mutate: logoutUser, isPending: isLoggingOut } = useLogoutMutation();
  const { data: workspaces, isLoading: isWorkspacesLoading } = useMyWorkspaces();
  const me = useAuthUser();
  const isMeLoading = me === null;

  // URL 경로에서 현재 섹션 추출: /workspace/:workspaceId/:section -> section
  const currentSection = pathname.split("/")[2] ?? "";

  const handleSwitchWorkspace = (id: string) => {
    startTransition(() => router.push(`/${id}/${currentSection}`));
  };

  const handleNavToSection = (section: string) => {
    startTransition(() => router.push(`/${workspaceId}/${section}`));
  };

  return (
    <nav className="flex h-full flex-col bg-[#111827]">
      {/* ① 상단: 워크스페이스 스위처 + 토글 (고정) — 헤더 껍데기는 부모가 소유 */}
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-white/[0.18]",
          collapsed ? "h-auto flex-col gap-2 py-2" : "h-16 gap-2 px-3",
        )}
      >
        <RouteProgressBar isNavigating={isNavigating} />

        <WorkspaceSwitcher
          workspaces={workspaces ?? []}
          currentId={workspaceId}
          onSwitch={handleSwitchWorkspace}
          onCreate={() => setIsCreateModalOpen(true)}
          collapsed={collapsed}
          isLoading={isWorkspacesLoading}
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
                active={item.href === currentSection}
                onClick={() => handleNavToSection(item.href)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ③ 하단: 유저 프로필 (고정) */}
      <div className="shrink-0 border-t border-white/10 p-2">
        <SidebarUserProfile
          user={{
            name: String(me?.name ?? ""),
            email: me?.email ?? "",
          }}
          collapsed={collapsed}
          isLoading={isMeLoading}
          onLogout={() => logoutUser()}
          isLoggingOut={isLoggingOut}
        />
      </div>

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreated={workspaceId => router.push(`/${workspaceId}/dashboard`)}
      />
    </nav>
  );
}
