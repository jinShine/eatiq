import { cn } from "@utils/shadcn";

import { STAGE_META, type StageCode } from "./progressOptions";

type StageBadgeProps = {
  stage: StageCode;
  className?: string;
};

export default function StageBadge({ stage, className }: StageBadgeProps) {
  const meta = STAGE_META[stage];

  if (!meta) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-1 text-[11px] font-medium whitespace-nowrap",
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
