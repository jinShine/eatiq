"use client";

import { useState } from "react";

import { motion, useReducedMotion } from "motion/react";

import {
  CreateWorkspaceModal,
  WORKSPACE_TYPE_OPTIONS,
  type WorkspaceType,
  WorkspaceTypeCard,
} from "@components/custom/workspace";

type WorkspaceEmptyStateProps = {
  onCreated: (workspaceId: string) => void;
};

/**
 * 워크스페이스가 하나도 없을 때의 첫 화면.
 *
 * "만들기" 버튼 하나만 두면 유형 선택이 모달 안에 숨는다.
 * 유형은 생성 뒤 바꿀 수 없는 결정이라 화면에서 바로 비교하고 고르게 했다.
 * 카드를 누르면 유형 단계를 건너뛰고 이름만 받는다.
 */
export default function WorkspaceEmptyState({ onCreated }: WorkspaceEmptyStateProps) {
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

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-[640px] flex-col gap-8">
        <motion.div className="flex flex-col gap-2" {...reveal(0)}>
          <p className="text-primary text-xs font-bold tracking-[0.04em] uppercase">Workspace</p>
          <h1 className="text-text-primary text-2xl font-bold tracking-[-1.2px]">어디서부터 시작할까요?</h1>
          <p className="text-text-tertiary text-sm leading-relaxed">
            워크스페이스를 만들면 회사 정보를 정리하고 파트너를 찾을 수 있어요.
            <br />
            유형은 만든 뒤에 바꿀 수 없으니 신중히 골라주세요.
          </p>
        </motion.div>

        <div role="radiogroup" aria-label="워크스페이스 유형" className="grid gap-3 sm:grid-cols-2">
          {WORKSPACE_TYPE_OPTIONS.map((option, index) => (
            <motion.div key={option.value} className="flex" {...reveal(index + 1)}>
              <WorkspaceTypeCard option={option} size="lg" onSelect={handleSelect} />
            </motion.div>
          ))}
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
