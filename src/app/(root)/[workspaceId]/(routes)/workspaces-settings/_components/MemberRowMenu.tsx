"use client";

import { MoreVertical } from "lucide-react";

import { DropdownMenu, DropdownMenuItem } from "@components/ui";

import { type WorkspaceMember } from "@services/api/workspace/workspace.type";

export type MemberAction = "promote" | "demote" | "remove" | "resendInvite" | "cancelInvite" | "deleteFromList";

type MenuItem = { action: MemberAction; label: string; isDestructive?: boolean };

/**
 * 상태별 메뉴 항목 (피그마 node 693:3330~3332).
 *
 * 스펙의 유니온에 없는 "초대취소"가 실제로 내려온다(실측). Record로 두면
 * 없는 키에서 화면이 죽으므로 Partial로 두고, 모르는 상태에는 메뉴를 그리지 않는다.
 * variant는 되돌리기 어려운 쪽만 destructive로 둔다.
 */
const MENU_ITEMS: Partial<Record<string, MenuItem[]>> = {
  초대중: [
    { action: "resendInvite", label: "다시 초대" },
    { action: "cancelInvite", label: "초대 취소", isDestructive: true },
  ],
  초대거절: [
    { action: "resendInvite", label: "다시 초대" },
    { action: "deleteFromList", label: "목록에서 삭제", isDestructive: true },
  ],
  /**
   * 취소된 초대는 같은 주소로 다시 초대할 수 있지만 목록에서 지울 수는 없다.
   * remove API가 "초대거절 상태인 멤버만" 허용한다(실측 400).
   * TODO(백엔드): 초대취소 멤버도 제거할 수 있어야 목록이 정리된다.
   */
  초대취소: [{ action: "resendInvite", label: "다시 초대" }],
};

type MemberRowMenuProps = {
  member: WorkspaceMember;
  /** 다른 액션이 처리 중일 때 — 같은 항목을 두 번 누르면 두 번째는 대상이 없어 실패한다 */
  disabled?: boolean;
  onSelect: (action: MemberAction, member: WorkspaceMember) => void;
};

/**
 * 활성 멤버는 등급에 따라 항목이 갈린다.
 *
 * 피그마는 관리자 1명을 전제로 "관리자로 전환"만 그렸지만, 서버는 관리자
 * 여러 명을 허용하고 기존 관리자를 강등하지 않는다(실측). 이미 관리자인 사람에게
 * "관리자로 전환"을 띄우면 동일 등급 변경으로 400이 나고, 되돌릴 길도 없어진다.
 */
const getItems = (member: WorkspaceMember): MenuItem[] | undefined => {
  if (member.status !== "활성") {
    return MENU_ITEMS[member.status];
  }

  const gradeItem: MenuItem =
    member.grade === "관리자"
      ? { action: "demote", label: "사용자로 변경" }
      : { action: "promote", label: "관리자로 전환" };

  return [gradeItem, { action: "remove", label: "사용자 내보내기", isDestructive: true }];
};

export default function MemberRowMenu({ member, disabled, onSelect }: MemberRowMenuProps) {
  const items = getItems(member);

  // 처음 보는 상태에는 무엇을 할 수 있는지 알 수 없다. 빈 메뉴를 띄우느니 그리지 않는다
  if (!items) {
    return null;
  }

  return (
    <DropdownMenu
      align="end"
      className="w-[160px]"
      trigger={
        <button
          type="button"
          aria-label={`${member.name ?? member.email} 관리 메뉴`}
          disabled={disabled}
          className="text-text-disabled hover:text-text-primary focus-visible:ring-ring flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:outline-none"
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
