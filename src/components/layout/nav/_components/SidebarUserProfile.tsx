import { Skeleton } from "@components/ui";

import { getInitial } from "@utils/functions";
import { cn } from "@utils/shadcn";

export type SidebarUser = {
  name: string;
  email: string;
};

type SidebarUserProfileProps = {
  user: SidebarUser;
  collapsed?: boolean;
  isLoading?: boolean;
};

export default function SidebarUserProfile({ user, collapsed = false, isLoading }: SidebarUserProfileProps) {
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
    <div className={cn("flex items-center gap-2 px-1.5 py-1.5", collapsed && "justify-center px-0")}>
      <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
        {getInitial(user.name)}
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#e6e6ea]">{user.name}</p>
          <p className="truncate text-xs text-[#9a9aa6]">{user.email}</p>
        </div>
      )}
    </div>
  );
}
