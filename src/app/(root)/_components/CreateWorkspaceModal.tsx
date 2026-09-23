"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import z from "zod";

import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Toast } from "@components/ui";

import { useCreateWorkspaceMutation } from "@services/api/workspace/workspace.query";

import WorkspaceTypeCard, { WORKSPACE_TYPE_OPTIONS, type WorkspaceType } from "./WorkspaceTypeCard";

const nameSchema = z.object({
  name: z.string().trim().min(1, "워크스페이스 이름을 입력해주세요."),
});

type NameForm = z.infer<typeof nameSchema>;

type CreateWorkspaceModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** 유형을 이미 고른 채로 열면 이름 입력부터 시작한다 */
  defaultType?: WorkspaceType;
  /** 생성이 끝나면 새 워크스페이스 id를 넘긴다. 이동 여부는 호출부가 정한다 */
  onCreated: (workspaceId: string) => void;
};

/**
 * 워크스페이스 생성 — 유형 선택 → 이름 입력.
 *
 * 빈 화면에서 유형 카드를 눌러 들어오면 유형 단계를 건너뛴다.
 * 유형은 생성 뒤 바꿀 수 없어서(기획 확정) 되돌아갈 길은 항상 열어둔다.
 *
 * TODO(기획·API): 생성 직후 "회사 기본 데이터 연결" 단계가 설계돼 있으나 기획 미정이다.
 * 도메인 기반 회사 후보 조회·연결 API도 없어, 지금은 생성 후 바로 대시보드로 보낸다.
 */
export default function CreateWorkspaceModal({
  isOpen,
  onOpenChange,
  defaultType,
  onCreated,
}: CreateWorkspaceModalProps) {
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState<"type" | "name">(defaultType ? "name" : "type");
  const [type, setType] = useState<WorkspaceType>(defaultType ?? "brand");

  const { mutate: createWorkspace, isPending } = useCreateWorkspaceMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NameForm>({ resolver: zodResolver(nameSchema) });

  // 빈 화면에서 고른 유형을 들고 열릴 때마다 그 값으로 맞춘다
  useEffect(() => {
    if (isOpen && defaultType) {
      setType(defaultType);
      setStep("name");
    }
  }, [isOpen, defaultType]);

  /** 닫을 때는 처음 상태로 되돌린다. 다음에 열었을 때 이전 입력이 남아 있으면 안 된다 */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep(defaultType ? "name" : "type");
      setType(defaultType ?? "brand");
      reset();
    }
    onOpenChange(open);
  };

  const onSubmit = (values: NameForm) => {
    createWorkspace(
      { name: values.name, type },
      {
        onSuccess: response => {
          handleOpenChange(false);
          onCreated(String(response.workspace.uid));
        },
        onError: () => Toast.error("워크스페이스 생성에 실패했어요. 다시 시도해주세요."),
      },
    );
  };

  const selectedLabel = WORKSPACE_TYPE_OPTIONS.find(option => option.value === type)?.label;

  // ModalContent가 grid gap-4라 motion으로 감싸면 그 간격이 사라진다. 안에서 직접 준다
  const stepMotion = shouldReduceMotion
    ? { className: "flex flex-col gap-5" }
    : {
        className: "flex flex-col gap-5",
        initial: { opacity: 0, x: 12 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -12 },
        transition: { type: "spring" as const, stiffness: 320, damping: 30 },
      };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} className="w-full sm:max-w-[520px]">
      <ModalHeader>
        <span className="flex items-baseline gap-2">
          워크스페이스 생성
          {!defaultType && <span className="text-text-disabled text-xs font-medium">{step === "type" ? 1 : 2}/2</span>}
        </span>
      </ModalHeader>

      <AnimatePresence mode="wait" initial={false}>
        {step === "type" ? (
          <motion.div key="type" {...stepMotion}>
            <ModalBody className="gap-4">
              <p className="text-text-primary text-sm font-bold tracking-[-0.7px]">어떤 워크스페이스를 만드시나요?</p>

              <div role="radiogroup" aria-label="워크스페이스 유형" className="flex gap-3">
                {WORKSPACE_TYPE_OPTIONS.map(option => (
                  <WorkspaceTypeCard
                    key={option.value}
                    option={option}
                    isSelected={type === option.value}
                    onSelect={setType}
                  />
                ))}
              </div>
            </ModalBody>

            <ModalFooter className="border-border border-t pt-4">
              <Button onClick={() => setStep("name")}>다음</Button>
            </ModalFooter>
          </motion.div>
        ) : (
          <motion.form key="name" noValidate onSubmit={handleSubmit(onSubmit)} {...stepMotion}>
            <ModalBody className="gap-2">
              <p className="text-text-primary text-sm font-bold tracking-[-0.7px]">워크스페이스의 이름을 알려주세요</p>
              <p className="text-text-tertiary mb-1 text-xs">
                <span className="text-primary font-semibold">{selectedLabel}</span> 워크스페이스로 만들어져요. 나중에
                바꿀 수 없어요.
              </p>

              <Input
                autoFocus
                placeholder="예: 플러그푸드 코리아"
                error={Boolean(errors.name)}
                errorText={errors.name?.message}
                {...register("name")}
              />
            </ModalBody>

            <ModalFooter className="border-border border-t pt-4 sm:justify-between sm:space-x-0">
              {defaultType ? (
                <span />
              ) : (
                <Button type="button" variant="ghost" size="sm" className="gap-1" onClick={() => setStep("type")}>
                  <ArrowLeft className="size-4" />
                  이전
                </Button>
              )}

              <Button type="submit" isLoading={isPending}>
                생성하기
              </Button>
            </ModalFooter>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
}
