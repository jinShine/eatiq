"use client";

import dayjs from "dayjs";
import { MoreVertical } from "lucide-react";

import { type WorkspaceMember } from "@services/api/workspace/workspace.type";

import { cn } from "@utils/shadcn";

import MemberStatusBadge from "./MemberStatusBadge";

const EMPTY_CELL = "—";

const COLUMNS = ["이름", "이메일", "권한", "상태", "최근 접속일"] as const;

/** 헤더와 행이 같은 그리드를 공유해야 컬럼이 어긋나지 않는다 */
const GRID_COLS = "grid grid-cols-[1.1fr_1.8fr_0.7fr_0.9fr_1fr_40px] items-center gap-3 px-6";

const formatDate = (date: string | null) => (date ? dayjs(date).format("YYYY.MM.DD") : EMPTY_CELL);

type MemberTableProps = {
  members: WorkspaceMember[];
  /**
   * 이 행의 메뉴를 열 수 있는지.
   *
   * 관리자 여부·본인 여부 판단은 호출부가 한다. 표가 그 규칙을 알면
   * "초대거절은 관리자라도 제외" 같은 조건이 붙을 때마다 표를 고쳐야 한다.
   */
  canManage: (member: WorkspaceMember) => boolean;
  onOpenMenu: (member: WorkspaceMember) => void;
};

export default function MemberTable({ members, canManage, onOpenMenu }: MemberTableProps) {
  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <div className={cn(GRID_COLS, "h-11 border-b", "bg-secondary-background")} aria-hidden>
        {COLUMNS.map(column => (
          <span key={column} className="text-text-tertiary text-xs font-medium whitespace-nowrap">
            {column}
          </span>
        ))}
        <span />
      </div>

      <ul className="divide-border divide-y">
        {members.map(member => (
          <li key={member.id} className={cn(GRID_COLS, "h-14")}>
            {/* 가입 전이라 이름이 없다. 빈칸보다 "아직 없다"는 정보를 주는 쪽이 낫다 */}
            {member.name ? (
              <span className="text-text-primary truncate text-sm font-bold">{member.name}</span>
            ) : (
              <span className="text-text-disabled truncate text-sm">초대 대기</span>
            )}

            <span className="text-text-tertiary truncate text-sm">{member.email}</span>

            <span className="text-text-secondary truncate text-sm">{member.grade}</span>

            <MemberStatusBadge status={member.status} />

            <span className="text-text-tertiary truncate text-sm">{formatDate(member.lastConnectedAt)}</span>

            {canManage(member) ? (
              <button
                type="button"
                aria-label={`${member.name ?? member.email} 관리 메뉴`}
                onClick={() => onOpenMenu(member)}
                className="text-text-disabled hover:text-text-primary focus-visible:ring-ring flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:outline-none"
              >
                <MoreVertical className="size-4" />
              </button>
            ) : (
              // 자리를 비워도 grid가 유지되도록 빈 칸을 둔다
              <span />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
