import { type LucideIcon } from "lucide-react";

import { cn } from "@utils/shadcn";

type InviteCardProps = {
  icon: LucideIcon;
  /** 아이콘 톤 — 안내는 기본, 막힌 상태는 주의색 */
  tone?: "default" | "warning";
  title: string;
  description: React.ReactNode;
  /** 버튼 등 액션 */
  children?: React.ReactNode;
};

/** 초대 화면의 모든 상태가 같은 껍데기를 쓴다 — 로그인 유도·수락·오류가 한 흐름으로 읽힌다 */
export default function InviteCard({ icon: Icon, tone = "default", title, description, children }: InviteCardProps) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-5 text-center">
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl",
            tone === "warning" ? "bg-warning-50 text-warning" : "bg-primary-50 text-primary",
          )}
        >
          <Icon className="size-6" strokeWidth={1.5} />
        </span>

        <div className="flex flex-col gap-2">
          <h1 className="text-text-primary text-lg font-bold tracking-[-0.9px]">{title}</h1>
          <p className="text-text-tertiary text-xs leading-relaxed">{description}</p>
        </div>

        {children && <div className="flex w-full flex-col gap-2 pt-1">{children}</div>}
      </div>
    </div>
  );
}
