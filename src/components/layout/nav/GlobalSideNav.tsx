import { BarChart3, FileText, LayoutDashboard, MapPin, Search, Store, User, Users } from "lucide-react";

import { cn } from "@utils/shadcn";

// EATIQ LINK 서비스 네비게이션 (보일러플레이트 레이아웃 시연용)
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "대시보드", active: true },
  { icon: Store, label: "브랜드 정보 설정" },
  { icon: FileText, label: "브랜드 문서 작성" },
  { icon: Search, label: "바이어 탐색" },
  { icon: BarChart3, label: "진행 관리" },
  { icon: MapPin, label: "AI 상권분석" },
  { icon: User, label: "내 정보 관리" },
  { icon: Users, label: "워크스페이스 관리" },
];

export default function GlobalSideNav() {
  return (
    <nav className="bg-background flex h-full flex-col">
      {/* 로고 */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-sm font-bold">
          E
        </div>
        <span className="text-text-primary text-base font-bold tracking-tight">
          EATIQ <span className="text-text-tertiary font-medium">LINK</span>
        </span>
      </div>

      {/* 메뉴 */}
      <ul className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <li key={label}>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active ? "bg-primary-light text-primary font-semibold" : "text-text-secondary hover:bg-accent",
              )}
            >
              <Icon className="size-4.5" />
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* 유저 프로필 */}
      <div className="border-border m-3 flex items-center gap-3 rounded-xl border p-3">
        <div className="bg-primary-light text-primary flex size-9 items-center justify-center rounded-full text-sm font-bold">
          몽
        </div>
        <div className="min-w-0">
          <p className="text-text-primary truncate text-sm font-semibold">몽탄</p>
          <p className="text-text-tertiary truncate text-xs">dev_front@eatiq.io</p>
        </div>
      </div>
    </nav>
  );
}
