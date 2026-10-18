import { SearchX, TriangleAlert, Users } from "lucide-react";

import { Button } from "@components/ui";

type ProgressEmptyStateProps = {
  /** 데이터 자체가 없는지 · 필터 결과가 비었는지 · 불러오지 못했는지에 따라 안내가 달라진다 */
  variant: "no-data" | "no-result" | "error";
  /** 「바이어」 또는 「브랜드」 */
  partnerLabel: string;
  /** error일 때 보여줄 서버 문구 */
  errorMessage?: string;
  onResetFilters?: () => void;
  onRetry?: () => void;
  onAdd?: () => void;
};

const getContent = (variant: ProgressEmptyStateProps["variant"], partnerLabel: string, errorMessage?: string) =>
  ({
    "no-data": {
      icon: Users,
      title: `아직 관리 중인 ${partnerLabel}가 없어요`,
      description: `관심 있는 ${partnerLabel}를 추가하면 접점 기록과 다음 액션을 여기서 관리할 수 있어요.`,
    },
    "no-result": {
      icon: SearchX,
      title: `조건에 맞는 ${partnerLabel}가 없어요`,
      description: "검색어나 필터를 바꿔서 다시 찾아보세요.",
    },
    "error": {
      icon: TriangleAlert,
      title: "진행 관리 목록을 불러오지 못했어요",
      description: errorMessage ?? "잠시 후 다시 시도해주세요.",
    },
  })[variant];

export default function ProgressEmptyState({
  variant,
  partnerLabel,
  errorMessage,
  onResetFilters,
  onRetry,
  onAdd,
}: ProgressEmptyStateProps) {
  const { icon: Icon, title, description } = getContent(variant, partnerLabel, errorMessage);

  return (
    <div className="border-border flex flex-col items-center rounded-2xl border bg-white px-6 py-20 text-center">
      <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>

      <p className="text-text-primary mt-5 text-sm font-semibold">{title}</p>
      <p className="text-text-tertiary mt-1.5 max-w-[36ch] text-xs leading-relaxed whitespace-pre-line">
        {description}
      </p>

      {variant === "no-result" && onResetFilters && (
        <Button variant="outline" size="sm" className="mt-6" onClick={onResetFilters}>
          필터 초기화
        </Button>
      )}

      {variant === "error" && onRetry && (
        <Button variant="outline" size="sm" className="mt-6" onClick={onRetry}>
          다시 시도
        </Button>
      )}

      {variant === "no-data" && onAdd && (
        <Button size="sm" className="mt-6" onClick={onAdd}>
          {partnerLabel} 추가
        </Button>
      )}
    </div>
  );
}
