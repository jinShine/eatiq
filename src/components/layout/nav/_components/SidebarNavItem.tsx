import { type LucideIcon } from "lucide-react";

import { cn } from "@utils/shadcn";

type SidebarNavItemProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
};

export default function SidebarNavItem({
  icon: Icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: SidebarNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center rounded-lg text-sm transition-all duration-300 ease-in-out",
        collapsed ? "mx-auto size-9 justify-center" : "w-full px-2.5 py-2",
        active ? "bg-primary text-white" : "text-[#c9c9d0] hover:bg-white/10",
      )}
    >
      <Icon className="size-4.5 shrink-0" />
      <span
        className={cn(
          "truncate text-left transition-all duration-300 ease-in-out",
          collapsed ? "ml-0 max-w-0 opacity-0" : "ml-3 max-w-[180px] flex-1 opacity-100",
        )}
      >
        {label}
      </span>
    </button>
  );
}
