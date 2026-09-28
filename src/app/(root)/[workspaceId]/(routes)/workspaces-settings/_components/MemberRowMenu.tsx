"use client";

import { MoreVertical } from "lucide-react";

import { DropdownMenu, DropdownMenuItem } from "@components/ui";

import { type WorkspaceMember, type WorkspaceMemberStatus } from "@services/api/workspace/workspace.type";

export type MemberAction = "changeGrade" | "remove" | "resendInvite" | "cancelInvite" | "deleteFromList";

/**
 * 상태별 메뉴 항목 (피그마 node 693:3330~3332).
 *
 * Record로 두면 백엔드가 상태를 추가했을 때 키 누락이 컴파일 에러로 잡힌다.
 * variant는 되돌리기 어려운 쪽만 destructive로 둔다.
 */
const MENU_ITEMS: Record<WorkspaceMemberStatus, { action: MemberAction; label: string; isDestructive?: boolean }[]> = {
  활성: [
    { action: "changeGrade", label: "관리자로 전환" },
    { action: "remove", label: "사용자 내보내기", isDestructive: true },
  ],
  초대중: [
    { action: "resendInvite", label: "다시 초대" },
    { action: "cancelInvite", label: "초대 취소", isDestructive: true },
  ],
  초대거절: [
    { action: "resendInvite", label: "다시 초대" },
    { action: "deleteFromList", label: "목록에서 삭제", isDestructive: true },
  ],
};

type MemberRowMenuProps = {
  member: WorkspaceMember;
  onSelect: (action: MemberAction, member: WorkspaceMember) => void;
};

export default function MemberRowMenu({ member, onSelect }: MemberRowMenuProps) {
  const items = MENU_ITEMS[member.status];

  return (
    <DropdownMenu
      align="end"
      className="w-[160px]"
      trigger={
        <button
          type="button"
          aria-label={`${member.name ?? member.email} 관리 메뉴`}
          className="text-text-disabled hover:text-text-primary focus-visible:ring-ring flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:outline-none"
        >
          <MoreVertical className="size-4" />
        </button>
      }
    >
      {items.map(item => (
        <DropdownMenuItem
          key={item.action}
          variant={item.isDestructive ? "destructive" : "default"}
          onClick={() => onSelect(item.action, member)}
        >
          {item.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}
