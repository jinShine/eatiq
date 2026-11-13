import { type CompanyIntroStatus } from "@services/api/document/document.type";

import { cn } from "@utils/shadcn";

/** 문서 상태 배지 — 생성 전(회색) · 최신(초록) · 업데이트 필요(주황). 스웨거 연동 가이드의 색 */
const STATUS_STYLE: Record<CompanyIntroStatus | "none", { label: string; className: string }> = {
  none: { label: "생성 전", className: "bg-secondary-background text-text-secondary" },
  최신: { label: "최신", className: "bg-success-background text-success" },
  업데이트필요: { label: "업데이트 필요", className: "bg-warning-background text-warning" },
};

type IntroStatusBadgeProps = {
  /** null — 아직 만들지 않음 */
  status: CompanyIntroStatus | null;
};

export default function IntroStatusBadge({ status }: IntroStatusBadgeProps) {
  const { label, className } = STATUS_STYLE[status ?? "none"];

  return <span className={cn("rounded-full px-2 py-0.5 text-sm font-semibold", className)}>{label}</span>;
}
