import { LogOutIcon } from "lucide-react";

import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, Skeleton } from "@components/ui";

import { getInitial } from "@utils/functions";
import { cn } from "@utils/shadcn";

export type SidebarUser = {
  name: string;
  email: string;
};

type SidebarUserProfileProps = {
  user: SidebarUser;
  /** 로그아웃 동작은 호출부가 주입한다 — 이 컴포넌트는 표시만 맡는다 */
  onLogout: () => void;
  collapsed?: boolean;
  isLoading?: boolean;
  isLoggingOut?: boolean;
};

export default function SidebarUserProfile({
  user,
  onLogout,
  collapsed = false,
  isLoading,
  isLoggingOut,
}: SidebarUserProfileProps) {
  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2 px-1.5 py-1.5", collapsed && "justify-center px-0")}>
        <Skeleton className="size-8 shrink-0 rounded-full bg-white/10" />
        {!collapsed && (
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-16 bg-white/10" />
            <Skeleton className="h-3 w-28 bg-white/10" />
          </div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu
      align="start"
      side="top"
      className="w-[220px]"
      trigger={
        <button
          aria-label="계정 메뉴"
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left hover:bg-white/10",
            collapsed && "w-fit! justify-center px-2",
          )}
          style={{ width: 250 }}
        >
          <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {getInitial(user.name)}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#e6e6ea]">{user.name}</p>
              <p className="truncate text-xs text-[#9a9aa6]">{user.email}</p>
            </div>
          )}
        </button>
      }
    >
      {/* 축소 상태에서는 트리거에 이름이 안 보이므로 메뉴 안에서 누구인지 알려준다 */}
      <div className="px-2 py-1.5">
        <p className="text-text-primary truncate text-sm font-semibold">{user.name}</p>
        <p className="text-text-tertiary truncate text-xs">{user.email}</p>
      </div>

      <DropdownMenuSeparator />

      <DropdownMenuItem variant="destructive" disabled={isLoggingOut} onClick={onLogout} className="gap-2">
        <LogOutIcon />
        로그아웃
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
