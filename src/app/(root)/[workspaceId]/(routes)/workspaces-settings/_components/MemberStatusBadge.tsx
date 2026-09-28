import { type WorkspaceMemberStatus } from "@services/api/workspace/workspace.type";

import { cn } from "@utils/shadcn";

/**
 * 상태별 표시 문구와 색.
 *
 * 서버 값("초대거절")과 화면 문구("초대 거절")가 다르다. 서버 값을 그대로
 * 출력하면 백엔드가 표기를 바꿀 때 화면이 따라 바뀐다 — 문구는 기획이 정할 일이다.
 *
 * Record로 두면 백엔드가 상태를 추가했을 때 키 누락이 컴파일 에러로 잡힌다.
 * if/else였다면 새 상태가 조용히 빈 배지로 떨어진다.
 */
const STATUS_STYLE: Record<WorkspaceMemberStatus, { label: string; className: string | null }> = {
  활성: { label: "활성", className: null },
  초대중: { label: "초대중", className: "border-success text-success" },
  초대거절: { label: "초대 거절", className: "border-warning text-warning" },
};

type MemberStatusBadgeProps = {
  status: WorkspaceMemberStatus;
};

export default function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  const style = STATUS_STYLE[status];

  // 활성은 기본 상태라 강조하지 않는다. 셋 다 배지면 어느 것도 눈에 띄지 않는다
  if (!style.className) {
    return <span className="text-text-secondary text-sm">{style.label}</span>;
  }

  return (
    <span
      className={cn(
        "w-fit inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}
