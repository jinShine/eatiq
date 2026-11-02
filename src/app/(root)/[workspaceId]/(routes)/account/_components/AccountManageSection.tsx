import { type ComponentProps } from "react";

import { Button } from "@components/ui";

import { cn } from "@utils/shadcn";

import AccountSection from "./AccountSection";

type ManageRowProps = {
  title: string;
  description: string;
  actionLabel: string;
  variant?: ComponentProps<typeof Button>["variant"];
  /** 되돌릴 수 없는 행동 — 설명도 경고색으로 */
  isDanger?: boolean;
  isPending?: boolean;
  onAction: () => void;
};

function ManageRow({
  title,
  description,
  actionLabel,
  variant = "outline",
  isDanger,
  isPending,
  onAction,
}: ManageRowProps) {
  return (
    // 좁은 화면에선 버튼을 문구 아래로 내린다. 옆에 두면 문구가 두세 줄로 쪼개진다
    <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 flex-col break-keep">
        <p className="text-text-primary text-sm font-bold">{title}</p>
        <p className={cn("text-sm", isDanger ? "text-destructive font-semibold" : "text-text-tertiary")}>
          {description}
        </p>
      </div>
      {/* 버튼 폭을 맞춰 세로로 한 줄에 서게 한다 (피그마 128px) */}
      <Button variant={variant} className="w-full shrink-0 sm:w-32" isLoading={isPending} onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

type AccountManageSectionProps = {
  /** 탈퇴 대상이 어느 워크스페이스인지 문구에 넣는다. 여러 곳에 속해 있으면 헷갈린다 */
  workspaceName?: string;
  isLoggingOut: boolean;
  onLogout: () => void;
  onWithdrawWorkspace: () => void;
  onDeleteAccount: () => void;
};

export default function AccountManageSection({
  workspaceName,
  isLoggingOut,
  onLogout,
  onWithdrawWorkspace,
  onDeleteAccount,
}: AccountManageSectionProps) {
  return (
    <AccountSection title="계정 관리">
      {/* 행마다 같은 구분선 — 시안은 로그아웃 아래에만 있어 두 행이 한 묶음처럼 보였다 */}
      <div className="divide-border flex flex-col divide-y px-6 py-3">
        <ManageRow
          title="로그아웃"
          description="이 기기에서 접속을 종료합니다"
          actionLabel="로그아웃"
          isPending={isLoggingOut}
          onAction={onLogout}
        />
        <ManageRow
          title="워크스페이스 탈퇴"
          description={
            workspaceName ? `‘${workspaceName}’ 워크스페이스에서 탈퇴합니다` : "이 워크스페이스에서 탈퇴합니다"
          }
          actionLabel="워크스페이스 탈퇴"
          onAction={onWithdrawWorkspace}
        />
        <ManageRow
          title="계정 삭제"
          description="계정을 삭제하면 다시 로그인할 수 없으며 복구할 수 없습니다"
          actionLabel="계정 삭제"
          variant="destructive"
          isDanger
          onAction={onDeleteAccount}
        />
      </div>
    </AccountSection>
  );
}
