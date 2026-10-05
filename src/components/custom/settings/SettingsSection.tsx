import { Button } from "@components/ui";

type SettingsSectionProps = {
  title: string;
  description?: string;
  isDirty?: boolean;
  isPending?: boolean;
  /**
   * 저장 실패 사유. 푸터의 저장 버튼 옆에 남긴다.
   * 토스트는 몇 초 뒤 사라져, 필드가 많은 섹션에서 무엇이 틀렸는지 읽기엔 짧다.
   */
  errorMessage?: string | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode; // 필드들 (3열 그리드의 자식)
};

// 설정 섹션 공통 카드 — 헤더(제목·부제) / 바디(3열 그리드) / 푸터(dirty·저장)
export default function SettingsSection({
  title,
  description,
  isDirty = false,
  isPending = false,
  errorMessage,
  onSubmit,
  children,
}: SettingsSectionProps) {
  // 검증 실패 시 화면 순서상 첫 오류 칸으로 포커스를 맞춘다.
  // RHF는 등록 순서로 첫 오류에 포커스하는데, register 칸과 Controller 칸(쉼표 입력·선택 박스)이 섞이면
  // Controller가 나중에 등록돼 화면 순서와 달라진다(가맹비보다 로열티 비율로 먼저 간다)
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    const form = event.currentTarget;
    await onSubmit(event);
    // 오류 표시(aria-invalid)가 그려진 다음에 찾는다. rAF는 화면이 가려지면 돌지 않아 setTimeout을 쓴다
    setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="border-border overflow-hidden rounded-2xl border">
      {/* 헤더 */}
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-text-primary text-base font-bold tracking-tight">{title}</h3>
        {description && <p className="text-text-tertiary mt-0.5 text-sm">{description}</p>}
      </div>

      {/* 바디 — 3열 그리드 (전체폭 필드는 자식에서 col-span-3) */}
      <div className="space-y-3 p-6">{children}</div>

      {/* 푸터 — 저장되지 않은 변경사항 + 저장 */}
      <div className="border-border bg-secondary-background flex items-center justify-between gap-4 border-t px-7 py-4">
        <div className="flex min-w-0 items-center gap-2">
          {/* 실패 사유가 있으면 그게 더 급하다. dirty 표시보다 먼저 보인다 */}
          {errorMessage ? (
            <p role="alert" className="text-destructive text-sm whitespace-pre-line">
              {errorMessage}
            </p>
          ) : (
            isDirty && (
              <>
                <span className="bg-primary size-2.5 shrink-0 rounded-full" />
                <span className="text-text-secondary text-sm">저장되지 않은 변경사항</span>
              </>
            )
          )}
        </div>
        <Button type="submit" size="sm" isLoading={isPending} disabled={!isDirty}>
          저장
        </Button>
      </div>
    </form>
  );
}
