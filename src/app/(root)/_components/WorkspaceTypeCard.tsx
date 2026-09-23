"use client";

import { Building2, Utensils } from "lucide-react";

import { cn } from "@utils/shadcn";

export type WorkspaceType = "brand" | "buyer";

export const WORKSPACE_TYPE_OPTIONS: {
  value: WorkspaceType;
  icon: typeof Utensils;
  label: string;
  description: string;
}[] = [
  {
    value: "brand",
    icon: Utensils,
    label: "브랜드",
    description: "해외 진출을 준비하는 F&B 브랜드. 바이어를 찾고 상권을 분석해요.",
  },
  {
    value: "buyer",
    icon: Building2,
    label: "바이어",
    description: "한국 브랜드를 도입하려는 해외 파트너. 브랜드를 탐색하고 검토해요.",
  },
];

type WorkspaceTypeCardProps = {
  option: (typeof WORKSPACE_TYPE_OPTIONS)[number];
  isSelected?: boolean;
  onSelect: (type: WorkspaceType) => void;
  /** lg는 빈 화면의 진입 카드, sm은 모달 안에서 고를 때 */
  size?: "sm" | "lg";
};

/**
 * 워크스페이스 유형 카드.
 *
 * 빈 화면의 진입점과 생성 모달이 같은 카드를 쓴다.
 * 유형은 생성 뒤 바꿀 수 없어서, 고르는 순간이 어디든 같은 정보를 같은 모양으로 보여줘야 한다.
 */
export default function WorkspaceTypeCard({ option, isSelected, onSelect, size = "sm" }: WorkspaceTypeCardProps) {
  const Icon = option.icon;
  const isLarge = size === "lg";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={Boolean(isSelected)}
      onClick={() => onSelect(option.value)}
      className={cn(
        "group flex flex-1 flex-col items-start rounded-2xl border-2 text-left",
        "transition-[background-color,border-color,box-shadow,transform] duration-200",
        "focus-visible:ring-ring active:scale-[0.98] focus-visible:ring-2 focus-visible:outline-none",
        isLarge ? "gap-3 p-6" : "gap-2 p-5",
        isSelected
          ? "border-primary bg-primary-50 shadow-[0_8px_24px_-12px_rgba(248,61,94,0.35)]"
          : "border-border hover:border-text-disabled bg-white hover:shadow-[0_8px_24px_-16px_rgba(17,24,39,0.25)]",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-xl transition-colors duration-200",
          isLarge ? "size-11" : "size-9",
          isSelected ? "bg-primary text-white" : "bg-accent text-text-tertiary group-hover:text-text-secondary",
        )}
      >
        <Icon className={isLarge ? "size-5" : "size-4"} strokeWidth={1.5} />
      </span>

      <span className={cn("text-text-primary font-bold tracking-[-0.9px]", isLarge ? "text-xl" : "text-lg")}>
        {option.label}
      </span>

      <span className={cn("text-text-tertiary leading-relaxed", isLarge ? "text-sm" : "text-[13px]")}>
        {option.description}
      </span>
    </button>
  );
}
