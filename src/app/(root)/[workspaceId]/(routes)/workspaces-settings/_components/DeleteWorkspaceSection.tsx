"use client";

import { Button } from "@components/ui";

type DeleteWorkspaceSectionProps = {
  onRequestDelete: () => void;
};

/**
 * 워크스페이스 삭제 진입점.
 *
 * SettingsSection을 쓰지 않는다. 저장 폼이 아니라 되돌릴 수 없는 한 번의 행동이라
 * dirty·저장 푸터가 붙으면 오히려 같은 종류로 읽힌다.
 */
export default function DeleteWorkspaceSection({ onRequestDelete }: DeleteWorkspaceSectionProps) {
  return (
    <section className="border-border overflow-hidden rounded-2xl border">
      <div className="border-border border-b px-6 py-4">
        <h3 className="text-text-primary text-base font-bold tracking-tight">워크스페이스 관리</h3>
      </div>

      <div className="flex items-center justify-between gap-6 p-6">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-text-primary text-sm font-bold">워크스페이스 삭제</p>
          <p className="text-destructive text-sm">워크스페이스의 모든 데이터가 삭제되며 복구할 수 없습니다</p>
        </div>

        <Button variant="destructive" size="sm" className="shrink-0" onClick={onRequestDelete}>
          워크스페이스 삭제
        </Button>
      </div>
    </section>
  );
}
