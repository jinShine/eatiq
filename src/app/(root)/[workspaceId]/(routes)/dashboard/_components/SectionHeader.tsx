import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  /** 오른쪽 「전체 보기 →」 링크 — 없으면 제목만 */
  moreHref?: string;
  moreLabel?: string;
};

/** 대시보드 섹션 제목 줄 (피그마: 18px Bold 제목 + 오른쪽 링크) */
export default function SectionHeader({ title, moreHref, moreLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-text-primary text-lg font-bold tracking-[-0.9px]">{title}</h2>
      {moreHref && moreLabel && (
        <Link
          href={moreHref}
          className="text-text-tertiary hover:text-text-primary focus-visible:ring-primary group inline-flex items-center gap-1 rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {moreLabel}
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
