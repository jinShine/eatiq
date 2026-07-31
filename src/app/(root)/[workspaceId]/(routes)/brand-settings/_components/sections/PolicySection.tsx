"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandPolicy } from "@services/api/brand/brand.query";
import { type BrandPolicy, type UpdatePolicyRequest } from "@services/api/brand/brand.type";

import FormSelect from "../FormSelect";
import SettingsSection from "../SettingsSection";
import { COMPLIANCE_OPTIONS, CONTRACT_TYPE_OPTIONS, SUPPLY_SCOPE_OPTIONS, YES_NO_OPTIONS } from "./policyOptions";

const policySchema = z.object({
  preferredContractType: z.string(),
  exclusivity: z.string(),
  menuLocalization: z.string(),
  interiorCompliance: z.string(),
  ingredientSupply: z.string(),
  trademark: z.string(),
  manualCompliance: z.string(),
});

type PolicyFormValues = z.infer<typeof policySchema>;

const EMPTY_VALUES: PolicyFormValues = {
  preferredContractType: "",
  exclusivity: "",
  menuLocalization: "",
  interiorCompliance: "",
  ingredientSupply: "",
  trademark: "",
  manualCompliance: "",
};

const toFormValues = (policy: BrandPolicy): PolicyFormValues => ({
  preferredContractType: policy.preferredContractType ?? "",
  exclusivity: policy.exclusivity ?? "",
  menuLocalization: policy.menuLocalization ?? "",
  interiorCompliance: policy.interiorCompliance ?? "",
  ingredientSupply: policy.ingredientSupply ?? "",
  trademark: policy.trademark ?? "",
  manualCompliance: policy.manualCompliance ?? "",
});

type PolicySectionProps = {
  workspaceId: string;
};

export default function PolicySection({ workspaceId }: PolicySectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateBrandPolicy, isPending } = useUpdateBrandPolicy(workspaceId);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandPolicy ? toFormValues(settings.brandPolicy) : undefined,
  });

  const onSubmit = (values: PolicyFormValues) => {
    const body: UpdatePolicyRequest = {
      ...values,
      ingredientSupplyRequired: settings?.brandPolicy?.ingredientSupplyRequired ?? false,
    };

    updateBrandPolicy(body, {
      onSuccess: () => Toast.success("계약 정책 정보를 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="계약 정책 정보"
      description="선호하는 계약 조건을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect
          control={control}
          name="preferredContractType"
          label="선호 계약 방식"
          options={CONTRACT_TYPE_OPTIONS}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect control={control} name="exclusivity" label="독점 여부" options={YES_NO_OPTIONS} />
        <FormSelect control={control} name="menuLocalization" label="메뉴 현지화 여부" options={YES_NO_OPTIONS} />
        <FormSelect control={control} name="interiorCompliance" label="인테리어 조정 여부" options={YES_NO_OPTIONS} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect
          control={control}
          name="ingredientSupply"
          label="식자재 공급 허용 범위"
          options={SUPPLY_SCOPE_OPTIONS}
        />
        <FormSelect control={control} name="trademark" label="상표 및 브랜드 사용 기준" options={COMPLIANCE_OPTIONS} />
        <FormSelect
          control={control}
          name="manualCompliance"
          label="운영 매뉴얼 준수 수준"
          options={COMPLIANCE_OPTIONS}
        />
      </div>
    </SettingsSection>
  );
}
