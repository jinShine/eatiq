"use client";

import { useState } from "react";

import { motion, useReducedMotion } from "motion/react";

import {
  CreateWorkspaceModal,
  InvitedWorkspaceList,
  WORKSPACE_TYPE_OPTIONS,
  type WorkspaceType,
  WorkspaceTypeCard,
} from "@components/custom/workspace";

import { type InvitedWorkspace } from "@services/api/workspace/workspace.type";

type WorkspaceEmptyStateProps = {
  /** 받은 초대. 있으면 생성보다 먼저 보여준다 */
  invites: InvitedWorkspace[];
  onCreated: (workspaceId: string) => void;
  onAccepted: (workspaceId: string) => void;
};

/**
 * 워크스페이스가 하나도 없을 때의 첫 화면.
 *
 * "만들기" 버튼 하나만 두면 유형 선택이 모달 안에 숨는다.
 * 유형은 생성 뒤 바꿀 수 없는 결정이라 화면에서 바로 비교하고 고르게 했다.
 * 카드를 누르면 유형 단계를 건너뛰고 이름만 받는다.
 *
 * 받은 초대가 있으면 그 목록이 먼저 온다. 초대를 받고 가입한 사람은 거의 확실히
 * 그 워크스페이스에 들어가려는 사람이다. 초대 메일을 거치지 않고 로그인한 경우나
 * 다른 기기에서 로그인해 초대 화면으로 돌아오지 못한 경우도 여기서 받는다.
 */
export default function WorkspaceEmptyState({ invites, onCreated, onAccepted }: WorkspaceEmptyStateProps) {
  const shouldReduceMotion = useReducedMotion();

  const [selectedType, setSelectedType] = useState<WorkspaceType>();

  const handleSelect = (type: WorkspaceType) => setSelectedType(type);

  const reveal = (index: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.07, type: "spring" as const, stiffness: 260, damping: 26 },
        };

  const hasInvites = invites.length > 0;

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-[640px] flex-col gap-8">
        <motion.div className="flex flex-col gap-2" {...reveal(0)}>
          <p className="text-primary text-xs font-bold tracking-[0.04em] uppercase">Workspace</p>
          {hasInvites ? (
            <>
              <h1 className="text-text-primary text-2xl font-bold tracking-[-1.2px]">초대받은 워크스페이스가 있어요</h1>
              <p className="text-text-tertiary text-sm leading-relaxed">수락하면 바로 함께 일할 수 있어요.</p>
            </>
          ) : (
            <>
              <h1 className="text-text-primary text-2xl font-bold tracking-[-1.2px]">어디서부터 시작할까요?</h1>
              <p className="text-text-tertiary text-sm leading-relaxed">
                워크스페이스를 만들면 회사 정보를 정리하고 파트너를 찾을 수 있어요.
                <br />
                유형은 만든 뒤에 바꿀 수 없으니 신중히 골라주세요.
              </p>
            </>
          )}
        </motion.div>

        {hasInvites && (
          <motion.section aria-label="받은 초대" className="flex flex-col gap-3" {...reveal(1)}>
            <p className="text-text-primary flex items-center gap-2 text-sm font-bold">
              받은 초대
              <span className="bg-primary-100 text-primary-700 rounded-full px-2 py-0.5 text-xs">{invites.length}</span>
            </p>
            <InvitedWorkspaceList invites={invites} onAccepted={onAccepted} />
          </motion.section>
        )}

        {/* 초대가 있어도 생성은 남긴다. 초대와 별개로 자기 워크스페이스를 만들려는 사람도 있다 */}
        <div className="flex flex-col gap-3">
          {hasInvites && (
            <div className="text-text-disabled flex items-center gap-3 text-xs">
              <span className="bg-border h-px flex-1" />
              또는 새로 만들기
              <span className="bg-border h-px flex-1" />
            </div>
          )}

          <div role="radiogroup" aria-label="워크스페이스 유형" className="grid gap-3 sm:grid-cols-2">
            {WORKSPACE_TYPE_OPTIONS.map((option, index) => (
              <motion.div key={option.value} className="flex" {...reveal(index + (hasInvites ? 2 : 1))}>
                <WorkspaceTypeCard option={option} size={hasInvites ? "sm" : "lg"} onSelect={handleSelect} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <CreateWorkspaceModal
        isOpen={selectedType !== undefined}
        onOpenChange={open => !open && setSelectedType(undefined)}
        defaultType={selectedType}
        onCreated={onCreated}
      />
    </div>
  );
}
