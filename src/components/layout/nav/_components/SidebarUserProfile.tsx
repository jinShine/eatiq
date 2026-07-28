import { getInitial } from "@utils/functions";
import { cn } from "@utils/shadcn";

export type SidebarUser = {
  name: string;
  email: string;
};

type SidebarUserProfileProps = {
  user: SidebarUser;
  collapsed?: boolean;
};

export default function SidebarUserProfile({ user, collapsed = false }: SidebarUserProfileProps) {
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
