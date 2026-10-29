import { MapPinned, SearchX, TriangleAlert } from "lucide-react";

import { Button } from "@components/ui";

type StoreSearchEmptyStateProps = {
  /** 기록 자체가 없는지 · 필터 결과가 비었는지 · 불러오지 못했는지에 따라 안내가 달라진다 */
  variant: "no-data" | "no-result" | "error";
  /** error일 때 보여줄 서버 문구 */
  errorMessage?: string;
  onResetFilters?: () => void;
  onRetry?: () => void;
  onStart?: () => void;
};

const getContent = (variant: StoreSearchEmptyStateProps["variant"], errorMessage?: string) =>
  ({
    "no-data": {
      icon: MapPinned,
      title: "아직 탐색한 상가 매물이 없어요",
      description: "진출하려는 국가·도시와 매장 조건을 입력하면 조건에 맞는 매물을 찾아드려요.",
    },
    "no-result": {
      icon: SearchX,
      title: "조건에 맞는 탐색 기록이 없어요",
      description: "필터를 바꿔서 다시 찾아보세요.",
    },
    "error": {
      icon: TriangleAlert,
      title: "탐색 기록을 불러오지 못했어요",
      description: errorMessage ?? "잠시 후 다시 시도해주세요.",
    },
  })[variant];

export default function StoreSearchEmptyState({
  variant,
  errorMessage,
  onResetFilters,
  onRetry,
  onStart,
}: StoreSearchEmptyStateProps) {
  const { icon: Icon, title, description } = getContent(variant, errorMessage);

  return (
    <div className="border-border flex flex-col items-center rounded-2xl border bg-white px-6 py-20 text-center">
      <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>

      <p className="text-text-primary mt-5 text-sm font-semibold">{title}</p>
      <p className="text-text-tertiary mt-1.5 max-w-[38ch] text-xs leading-relaxed whitespace-pre-line">
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

      {variant === "no-data" && onStart && (
        <Button size="sm" className="mt-6" onClick={onStart}>
          상권 분석 실행
        </Button>
      )}
    </div>
  );
}
