"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { SettingsSection } from "@components/custom/settings";
import { Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandSignature } from "@services/api/brand/brand.query";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import ContractPersonFields from "./ContractPersonFields";
import {
  type ContractPersonFormValues,
  EMPTY_CONTRACT_PERSON,
  contractPersonSchema,
  toContractPersonFormValues,
  toContractPersonRequest,
} from "./contractPersonForm";

const PLACEHOLDERS = {
  name_ko: "예: 박지훈",
  name_en: "예: Jihoon Park",
  position: "예: 대표이사",
  email: "예: ceo@rollingpasta.com",
};

type SignatorySectionProps = {
  workspaceId: string;
};

/** 서명권자 정보 — 폼 필드 이름은 저장 DTO와 같다. → BasicInfoSection 주석 참고 */
export default function SignatorySection({ workspaceId }: SignatorySectionProps) {
  // React Compiler 제외 — register 폼은 reset 뒤 입력칸이 갱신되지 않는다. → OperationSection 주석 참고
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_signature");
  const { mutate: save, isPending, error, reset: clearSaveError } = useUpdateBrandSignature(workspaceId);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ContractPersonFormValues>({
    resolver: zodResolver(contractPersonSchema),
    defaultValues: EMPTY_CONTRACT_PERSON,
    values: saved ? toContractPersonFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: ContractPersonFormValues) => {
    save(toContractPersonRequest(values), {
      onSuccess: response => {
        // 서버가 저장한 모양으로 폼을 맞춘다(목 모드는 보낸 값)
        reset(response ? toContractPersonFormValues(response.brand_signature) : values, { keepFieldsRef: true });
        Toast.success("서명권자 정보를 저장했어요.");
      },
    });
  };

  return (
    <SettingsSection
      title="서명권자 정보"
      description="서명권자의 정보를 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      <ContractPersonFields
        idPrefix="signature"
        role="서명권자"
        register={register}
        errors={errors}
        placeholders={PLACEHOLDERS}
      />
    </SettingsSection>
  );
}
