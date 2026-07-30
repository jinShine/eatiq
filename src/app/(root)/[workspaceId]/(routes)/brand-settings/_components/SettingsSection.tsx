import { Button } from "@components/ui";

type SettingsSectionProps = {
  title: string;
  description?: string;
  isDirty?: boolean;
  isPending?: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode; // 필드들 (3열 그리드의 자식)
};

// 설정 섹션 공통 카드 — 헤더(제목·부제) / 바디(3열 그리드) / 푸터(dirty·저장)
export default function SettingsSection({
  title,
  description,
  isDirty = false,
  isPending = false,
  onSubmit,
  children,
}: SettingsSectionProps) {
  return (
    <form onSubmit={onSubmit} className="border-border overflow-hidden rounded-2xl border">
      {/* 헤더 */}
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-text-primary text-base font-bold tracking-tight">{title}</h3>
        {description && <p className="text-text-tertiary mt-0.5 text-sm">{description}</p>}
      </div>

      {/* 바디 — 3열 그리드 (전체폭 필드는 자식에서 col-span-3) */}
      <div className="space-y-3 p-6">{children}</div>

      {/* 푸터 — 저장되지 않은 변경사항 + 저장 */}
      <div className="border-border bg-secondary-background flex items-center justify-between border-t px-7 py-4">
        <div className="flex items-center gap-2">
          {isDirty && (
            <>
              <span className="bg-primary size-2.5 shrink-0 rounded-full" />
              <span className="text-text-secondary text-sm">저장되지 않은 변경사항</span>
            </>
          )}
        </div>
        <Button type="submit" size="sm" isLoading={isPending} disabled={!isDirty}>
          저장
        </Button>
      </div>
    </form>
  );
}
