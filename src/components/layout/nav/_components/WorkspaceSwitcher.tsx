import { CheckIcon, ChevronDownIcon, MailIcon, PlusIcon } from "lucide-react";

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
  /** 받은 초대 수. 0이면 항목을 그리지 않는다 */
  inviteCount?: number;
  onOpenInvites?: () => void;
  collapsed?: boolean;
  isLoading?: boolean;
};

export default function WorkspaceSwitcher({
  workspaces,
  currentId,
  onSwitch,
  onCreate,
  inviteCount = 0,
  onOpenInvites,
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
          aria-label={inviteCount > 0 ? `워크스페이스 전환 · 받은 초대 ${inviteCount}개` : "워크스페이스 전환"}
          className={cn(
            "relative flex items-center rounded-lg hover:bg-white/10",
            collapsed ? "size-9 justify-center" : "gap-1.5 px-2 py-1.5",
          )}
        >
          {/* 드롭다운은 열기 전엔 안 보인다. 새 초대를 놓치지 않게 트리거에 점을 찍는다 */}
          {inviteCount > 0 && (
            <span aria-hidden className="bg-primary absolute top-1 right-1 size-2 rounded-full ring-2 ring-[#111827]" />
          )}
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

      {/* 이미 워크스페이스가 있는 사람은 루트의 초대 목록을 거치지 않는다. 새 초대를 볼 자리가 여기다 */}
      {inviteCount > 0 && (
        <DropdownMenuItem onClick={onOpenInvites} className="gap-2">
          <span className="bg-primary-50 text-primary flex size-6 shrink-0 items-center justify-center rounded-md">
            <MailIcon className="size-3.5" />
          </span>
          <span className="flex-1 truncate">받은 초대</span>
          <span className="bg-primary rounded-full px-1.5 text-[11px] leading-5 font-bold text-white">
            {inviteCount}
          </span>
        </DropdownMenuItem>
      )}

      <DropdownMenuItem onClick={onCreate} className="text-text-secondary gap-2">
        <span className="border-border flex size-6 shrink-0 items-center justify-center rounded-md border border-dashed">
          <PlusIcon className="size-3.5" />
        </span>
        <span className="flex-1 truncate">워크스페이스 추가</span>
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
