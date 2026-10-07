"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { SettingsSection } from "@components/custom/settings";
import { Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandContract } from "@services/api/brand/brand.query";

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
  name_ko: "예: 김도경",
  name_en: "예: Volt Kim",
  position: "예: 대리",
  email: "예: volt.kim@rollingpasta.com",
};

type ContractSectionProps = {
  workspaceId: string;
};

/** 계약 담당자 정보 — 폼 필드 이름은 저장 DTO와 같다. → BasicInfoSection 주석 참고 */
export default function ContractSection({ workspaceId }: ContractSectionProps) {
  // React Compiler 제외 — register 폼은 reset 뒤 입력칸이 갱신되지 않는다. → OperationSection 주석 참고
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_contract");
  const { mutate: save, isPending, error, reset: clearSaveError } = useUpdateBrandContract(workspaceId);

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
        reset(response ? toContractPersonFormValues(response.brand_contract) : values, { keepFieldsRef: true });
        Toast.success("계약 담당자 정보를 저장했어요.");
      },
    });
  };

  return (
    <SettingsSection
      title="계약 담당자 정보"
      description="계약 담당자의 정보를 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      <ContractPersonFields
        idPrefix="contract"
        role="담당자"
        register={register}
        errors={errors}
        placeholders={PLACEHOLDERS}
      />
    </SettingsSection>
  );
}
