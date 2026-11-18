import { Globe, Instagram, Youtube } from "lucide-react";

import { cn } from "@utils/shadcn";

import { type DetailRow, type ExternalLinkView, type MenuView, type YearBar } from "../brandView";

/************************************
 * 브랜드 상세 v2(피그마 2072:4921)의 조각들 — 섹션 머리·KPI·연도 막대·메뉴 카드·외부 링크
 ************************************/

export function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-text-primary text-sm font-bold tracking-[-0.7px]">{children}</h3>
      {aside && <p className="text-text-tertiary text-xs tracking-[-0.6px]">{aside}</p>}
    </div>
  );
}

/** 라벨 - 값 한 줄. 값이 없으면 시안대로 "-" */
export function TermRow({ row }: { row: DetailRow }) {
  return (
    <div className="border-border flex items-start justify-between gap-5 border-b py-2.5">
      <span className="text-text-tertiary shrink-0 text-sm font-medium tracking-[-0.7px]">{row.label}</span>
      <span className="text-text-primary text-right text-sm font-medium tracking-[-0.7px]">{row.value ?? "-"}</span>
    </div>
  );
}

/** 회색 숫자 카드 — 「가맹점 월평균 매출 3,508만 원」 */
export function KpiCard({ label, value, caption }: { label: string; value: string; caption?: string }) {
  return (
    <div className="bg-accent flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl p-3">
      <p className="text-text-tertiary text-xs font-medium tracking-[-0.6px]">{label}</p>
      <p className="text-text-primary text-xl font-bold tracking-[-1px]">{value}</p>
      {caption && <p className="text-text-tertiary text-[11px] font-medium tracking-[-0.55px]">{caption}</p>}
    </div>
  );
}

/** 막대 최대 높이 — 시안 96px */
const BAR_MAX_HEIGHT = 96;

/**
 * 연도별 막대 — 마지막(최근) 해만 진한 색. 시안의 막대는 단순 도형이라 차트 라이브러리 없이 그린다.
 * 높이는 가장 큰 값 기준 비율(0부터 시작해 값 차이를 부풀리지 않는다)
 */
export function YearBarChart({ bars, label }: { bars: YearBar[]; label: string }) {
  const max = Math.max(...bars.map(bar => bar.value));

  return (
    <ol aria-label={label} className="flex items-end justify-between px-2">
      {bars.map((bar, index) => {
        const isLatest = index === bars.length - 1;
        return (
          <li key={bar.year} className="flex flex-col items-center gap-1">
            <span className="text-text-primary text-xs font-semibold tracking-[-0.6px]">{bar.label}</span>
            <span
              aria-hidden
              className={cn("w-10 rounded-t", isLatest ? "bg-primary" : "bg-primary/25")}
              style={{ height: Math.max(4, Math.round((bar.value / max) * BAR_MAX_HEIGHT)) }}
            />
            <span className="text-text-tertiary text-xs font-medium tracking-[-0.6px]">{bar.year}</span>
          </li>
        );
      })}
    </ol>
  );
}

/** 대표 메뉴 카드 — 왼쪽 160px 사진, 오른쪽 이름·가격·영문·설명 */
export function MenuCard({ menu }: { menu: MenuView }) {
  return (
    <li className="border-border flex gap-3 rounded-xl border bg-white px-3 pt-3 pb-3.5">
      {/* 시안 160px. 좁은 화면에선 글자 칸이 너무 좁아져 120px로 줄인다 */}
      <div className="bg-accent size-[120px] shrink-0 overflow-hidden rounded-lg sm:size-[160px]">
        {menu.imageUrl && <img src={menu.imageUrl} alt={menu.name} className="size-full object-cover" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-text-primary text-sm font-bold tracking-[-0.7px] break-keep">{menu.name}</p>
          {menu.priceText && (
            <p className="text-text-primary shrink-0 text-sm font-semibold tracking-[-0.7px]">{menu.priceText}</p>
          )}
        </div>
        {menu.nameEn && <p className="text-text-tertiary text-xs tracking-[-0.6px]">{menu.nameEn}</p>}
        {menu.description && (
          <p className="text-text-secondary text-[13px] tracking-[-0.65px] break-keep">{menu.description}</p>
        )}
      </div>
    </li>
  );
}

const LINK_ICON = { homepage: Globe, instagram: Instagram, youtube: Youtube } as const;

/** 외부 링크 — 44px 원 아이콘 + 아래 이름 */
export function ExternalLinks({ links }: { links: ExternalLinkView[] }) {
  return (
    <ul className="flex gap-4">
      {links.map(link => {
        const Icon = LINK_ICON[link.kind];
        return (
          <li key={link.kind}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group focus-visible:ring-ring flex flex-col items-center gap-1.5 rounded-lg focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="border-border text-text-secondary group-hover:text-primary group-hover:border-primary flex size-11 items-center justify-center rounded-full border bg-white transition-colors">
                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <span className="text-text-tertiary text-xs font-medium">{link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
