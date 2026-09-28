import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";

import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, Skeleton } from "@components/ui";

import { getInitial } from "@utils/functions";
import { cn } from "@utils/shadcn";

type Workspace = {
  id: string;
  name: string;
};

type WorkspaceSwitcherProps = {
  workspaces: Workspace[];
  currentId: string;
  onSwitch: (id: string) => void;
  /** 목록 아래 "워크스페이스 추가" 항목을 눌렀을 때 */
  onCreate: () => void;
  collapsed?: boolean;
  isLoading?: boolean;
};

export default function WorkspaceSwitcher({
  workspaces,
  currentId,
  onSwitch,
  onCreate,
  collapsed,
  isLoading,
}: WorkspaceSwitcherProps) {
  if (isLoading) {
    return collapsed ? (
      <Skeleton className="size-9 rounded-lg bg-white/10" />
    ) : (
      <Skeleton className="h-5 w-28 rounded-md bg-white/10" />
    );
  }

  const currentWorkspace = workspaces.find(w => w.id === currentId);

  if (!currentWorkspace) {
    return null;
  }

  return (
    <DropdownMenu
      align="start"
      className="w-[240px]"
      trigger={
        <button
          className={cn(
            "flex items-center rounded-lg hover:bg-white/10",
            collapsed ? "size-9 justify-center" : "gap-1.5 px-2 py-1.5",
          )}
        >
          {collapsed ? (
            <span className="text-sm font-bold text-white">{getInitial(currentWorkspace.name)}</span>
          ) : (
            <>
              <span className="truncate text-[17px] leading-none font-bold text-white">{currentWorkspace.name}</span>
              <ChevronDownIcon className="size-4 shrink-0 text-white/60" />
            </>
          )}
        </button>
      }
    >
      {workspaces.map(ws => (
        <DropdownMenuItem key={ws.id} onClick={() => onSwitch(ws.id)} className="gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-700">
            {getInitial(ws.name)}
          </span>
          <span className="flex-1 truncate">{ws.name}</span>
          {ws.id === currentId && <CheckIcon className="text-primary size-4 shrink-0" />}
        </DropdownMenuItem>
      ))}

      {/* 목록과 구분선으로 떼어놓는다 — 전환과 생성은 성격이 다른 동작이라 나란히 두면 잘못 누른다 */}
      <DropdownMenuSeparator />

      <DropdownMenuItem onClick={onCreate} className="text-text-secondary gap-2">
        <span className="border-border flex size-6 shrink-0 items-center justify-center rounded-md border border-dashed">
          <PlusIcon className="size-3.5" />
        </span>
        <span className="flex-1 truncate">워크스페이스 추가</span>
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
