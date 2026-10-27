"use client";

import dayjs from "dayjs";

import { type WorkspaceMember } from "@services/api/workspace/workspace.type";

import { cn } from "@utils/shadcn";

import MemberStatusBadge from "./MemberStatusBadge";

const EMPTY_CELL = "—";

const COLUMNS = ["이름", "이메일", "권한", "상태", "최근 접속일"] as const;

/**
 * 헤더와 행(스켈레톤 포함)이 같은 그리드를 공유해야 컬럼이 어긋나지 않는다.
 * 권한은 세 글자라 좁게, 날짜는 "2026.10.28"이 잘리지 않을 만큼 둔다
 */
export const MEMBER_GRID_COLS = "grid grid-cols-[1.1fr_1.8fr_0.6fr_0.9fr_1.1fr_40px] items-center gap-3 px-6";

/** 이보다 좁아지면 이름·이메일이 몇 글자만 남는다 */
export const MEMBER_TABLE_MIN_WIDTH = "min-w-[520px]";

const formatDate = (date: string | null) => (date ? dayjs(date).format("YYYY.MM.DD") : EMPTY_CELL);

type MemberTableProps = {
  members: WorkspaceMember[];
  /**
   * 행 끝에 놓을 메뉴. null을 돌려주면 그 자리를 비운다.
   *
   * 표는 메뉴가 들어갈 자리만 제공한다. 누구에게 보일지(관리자·본인 여부)와
   * 무엇을 담을지(상태별 항목)는 전부 호출부가 정한다. 표가 그 규칙을 알면
   * 조건이 붙을 때마다 표를 고쳐야 한다.
   */
  renderMenu: (member: WorkspaceMember) => React.ReactNode | null;
};

export default function MemberTable({ members, renderMenu }: MemberTableProps) {
  return (
    <div className="border-border overflow-hidden rounded-xl border">
      {/* 좁은 화면에서 칸이 뭉개지지 않도록 가로 스크롤로 넘긴다 (진행 관리 표와 같은 방식) */}
      <div className="overflow-x-auto">
        <div className={MEMBER_TABLE_MIN_WIDTH}>
          <div className={cn(MEMBER_GRID_COLS, "h-11 border-b", "bg-secondary-background")} aria-hidden>
            {COLUMNS.map(column => (
              <span key={column} className="text-text-tertiary text-xs font-medium whitespace-nowrap">
                {column}
              </span>
            ))}
            <span />
          </div>

          <ul className="divide-border divide-y">
            {members.map(member => (
              <li key={member.id} className={cn(MEMBER_GRID_COLS, "h-14")}>
                {/* 가입 전이라 이름이 없다. 빈칸보다 "아직 없다"는 정보를 주는 쪽이 낫다 */}
                {member.name ? (
                  <span className="text-text-primary truncate text-sm font-bold">{member.name}</span>
                ) : (
                  <span className="text-text-disabled truncate text-sm">초대 대기</span>
                )}

                <span className="text-text-tertiary truncate text-sm" title={member.email}>
                  {member.email}
                </span>

                <span className="text-text-secondary truncate text-sm">{member.grade}</span>

                <MemberStatusBadge status={member.status} />

                <span className="text-text-tertiary truncate text-sm">{formatDate(member.lastConnectedAt)}</span>

                {/* 메뉴가 없어도 grid 칸은 유지해야 다른 행과 컬럼이 어긋나지 않는다 */}
                {renderMenu(member) ?? <span />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
