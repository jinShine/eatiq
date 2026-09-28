"use client";

import { Button } from "@components/ui";

import { type WorkspaceMember } from "@services/api/workspace/workspace.type";

import MemberTable from "./MemberTable";
import MemberTableSkeleton from "./MemberTableSkeleton";

type MemberSectionProps = {
  members: WorkspaceMember[];
  isLoading?: boolean;
  /** 초대 버튼은 관리자에게만 보인다 */
  canInvite: boolean;
  /** 행 끝 메뉴 — null이면 그 자리를 비운다 */
  renderMenu: (member: WorkspaceMember) => React.ReactNode | null;
  onInvite: () => void;
};

/**
 * 사용자 관리 카드.
 *
 * SettingsSection을 쓰지 않는다. 저장 폼이 아니라 목록이라
 * dirty·저장 푸터가 붙을 자리가 없다.
 */
export default function MemberSection({ members, isLoading, canInvite, renderMenu, onInvite }: MemberSectionProps) {
  return (
    <section className="border-border overflow-hidden rounded-2xl border">
      <div className="border-border flex items-center justify-between gap-4 border-b px-6 py-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="text-text-primary text-base font-bold tracking-tight">사용자 관리</h3>
          <p className="text-text-tertiary text-sm">워크스페이스의 사용자를 관리합니다</p>
        </div>

        {canInvite && (
          <Button size="sm" className="shrink-0" onClick={onInvite}>
            사용자 초대하기
          </Button>
        )}
      </div>

      <div className="p-6">
        {isLoading ? <MemberTableSkeleton /> : <MemberTable members={members} renderMenu={renderMenu} />}
      </div>
    </section>
  );
}
