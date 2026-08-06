import { SearchX, Users } from "lucide-react";

import { Button } from "@components/ui";

type ProgressEmptyStateProps = {
  /** 필터를 적용한 결과가 비었는지 · 데이터 자체가 없는지에 따라 안내가 달라진다 */
  variant: "no-data" | "no-result";
  onResetFilters?: () => void;
};

const CONTENT = {
  "no-data": {
    icon: Users,
    title: "아직 관리 중인 바이어가 없어요",
    description: "관심 있는 바이어를 추가하면 접점 기록과 다음 액션을 여기서 관리할 수 있어요.",
  },
  "no-result": {
    icon: SearchX,
    title: "조건에 맞는 바이어가 없어요",
    description: "검색어나 필터를 바꿔서 다시 찾아보세요.",
  },
} as const;

export default function ProgressEmptyState({ variant, onResetFilters }: ProgressEmptyStateProps) {
  const { icon: Icon, title, description } = CONTENT[variant];

  return (
    <div className="border-border flex flex-col items-center rounded-2xl border bg-white px-6 py-20 text-center">
      <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
        <Icon className="size-5" strokeWidth={1.5} />
      </div>

      <p className="text-text-primary mt-5 text-sm font-semibold">{title}</p>
      <p className="text-text-tertiary mt-1.5 max-w-[36ch] text-xs leading-relaxed">{description}</p>

      {variant === "no-result" && onResetFilters && (
        <Button variant="outline" size="sm" className="mt-6" onClick={onResetFilters}>
          필터 초기화
        </Button>
      )}

      {variant === "no-data" && (
        // TODO(API): 바이어 추가 모달이 준비되면 연결한다
        <Button size="sm" className="mt-6" disabled>
          관리 바이어 추가
        </Button>
      )}
    </div>
  );
}
