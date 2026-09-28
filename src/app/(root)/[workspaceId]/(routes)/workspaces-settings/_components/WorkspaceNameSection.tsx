"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Input } from "@components/ui";

const nameSchema = z.object({
  name: z.string().trim().min(1, "워크스페이스 이름을 입력해주세요."),
});

export type WorkspaceNameForm = z.infer<typeof nameSchema>;

type WorkspaceNameSectionProps = {
  /** 현재 저장된 이름 — 폼의 기준값이자 dirty 판정의 기준 */
  name: string;
  isPending?: boolean;
  onSubmit: (values: WorkspaceNameForm) => void;
};

/**
 * 워크스페이스 이름 변경.
 *
 * 브랜드 설정과 같은 SettingsSection을 쓴다. 저장 버튼·dirty 표시·여백이
 * 두 화면에서 같아야 설정 화면이 하나의 체계로 읽힌다.
 */
export default function WorkspaceNameSection({ name, isPending, onSubmit }: WorkspaceNameSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<WorkspaceNameForm>({
    resolver: zodResolver(nameSchema),
    values: { name },
  });

  return (
    <SettingsSection
      title="워크스페이스 정보"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="workspace-name" className="text-text-secondary text-sm font-medium">
          워크스페이스 이름
        </label>
        <Input
          id="workspace-name"
          placeholder="워크스페이스 이름을 입력해주세요"
          error={Boolean(errors.name)}
          errorText={errors.name?.message}
          {...register("name")}
        />
      </div>
    </SettingsSection>
  );
}
