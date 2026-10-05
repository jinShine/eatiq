"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandContractPolicy } from "@services/api/brand/brand.query";
import { type BrandContractPolicyData, type UpdateBrandContractPolicyRequest } from "@services/api/brand/brand.type";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import FormSelect from "../FormSelect";
import { pickOption, toOptions } from "./IntroOptions";
import {
  CONTRACT_TYPE_VALUES,
  EXCLUSIVITY_VALUES,
  INTERIOR_STANDARD_VALUES,
  MANUAL_COMPLIANCE_VALUES,
  MENU_LOCALIZATION_VALUES,
  SUPPLY_CHAIN_VALUES,
  TARGET_COUNTRY_VALUES,
  TRADEMARK_COMPLIANCE_VALUES,
} from "./policyOptions";

/**
 * 계약 정책 정보 — PUT /contract-policy. 폼 필드 이름은 저장 DTO와 같다. → BasicInfoSection 주석 참고
 *
 * 서버 필수는 정책 6개다. 진출 목표 국가·선호 계약 방식은 서버에서 선택이지만
 * 완성도 API는 필수(진출 희망 조건)로 센다 — 저장은 막지 않고 저니 패널이 안내한다.
 * 진출 목표 국가는 시안에 없지만 저장 API·완성도에 있어 추가했다(디자인 확인 요청).
 */
const SELECT_REQUIRED = "선택해주세요";

const optionalChoice = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")], { errorMap: () => ({ message: "목록에서 다시 선택해주세요" }) });
const requiredChoice = <T extends readonly [string, ...string[]]>(values: T) =>
  optionalChoice(values).refine(value => value !== "", SELECT_REQUIRED);

const policySchema = z.object({
  target_country: optionalChoice(TARGET_COUNTRY_VALUES),
  preferred_contract_type: optionalChoice(CONTRACT_TYPE_VALUES),
  exclusivity_level: requiredChoice(EXCLUSIVITY_VALUES),
  menu_localization_level: requiredChoice(MENU_LOCALIZATION_VALUES),
  interior_standard_policy: requiredChoice(INTERIOR_STANDARD_VALUES),
  supply_chain_policy: requiredChoice(SUPPLY_CHAIN_VALUES),
  trademark_compliance_level: requiredChoice(TRADEMARK_COMPLIANCE_VALUES),
  manual_compliance_level: requiredChoice(MANUAL_COMPLIANCE_VALUES),
});

type PolicyFormValues = z.infer<typeof policySchema>;

const EMPTY_VALUES: PolicyFormValues = {
  target_country: "",
  preferred_contract_type: "",
  exclusivity_level: "",
  menu_localization_level: "",
  interior_standard_policy: "",
  supply_chain_policy: "",
  trademark_compliance_level: "",
  manual_compliance_level: "",
};

/** 저장값 → 폼. 선택지에 없는 값은 "선택 안 함"으로 → IntroSection 주석 참고 */
const toFormValues = (saved: BrandContractPolicyData): PolicyFormValues => ({
  target_country: pickOption(TARGET_COUNTRY_VALUES, saved.target_country),
  preferred_contract_type: pickOption(CONTRACT_TYPE_VALUES, saved.preferred_contract_type),
  exclusivity_level: pickOption(EXCLUSIVITY_VALUES, saved.exclusivity_level),
  menu_localization_level: pickOption(MENU_LOCALIZATION_VALUES, saved.menu_localization_level),
  interior_standard_policy: pickOption(INTERIOR_STANDARD_VALUES, saved.interior_standard_policy),
  supply_chain_policy: pickOption(SUPPLY_CHAIN_VALUES, saved.supply_chain_policy),
  trademark_compliance_level: pickOption(TRADEMARK_COMPLIANCE_VALUES, saved.trademark_compliance_level),
  manual_compliance_level: pickOption(MANUAL_COMPLIANCE_VALUES, saved.manual_compliance_level),
});

/** 필수 선택은 검증을 통과했으면 빈 값이 아니다(requiredChoice) */
const chosen = <T extends string>(value: T | "") => value as T;

const toRequest = (values: PolicyFormValues): UpdateBrandContractPolicyRequest => ({
  target_country: values.target_country || undefined,
  preferred_contract_type: values.preferred_contract_type || undefined,
  exclusivity_level: chosen(values.exclusivity_level),
  menu_localization_level: chosen(values.menu_localization_level),
  interior_standard_policy: chosen(values.interior_standard_policy),
  supply_chain_policy: chosen(values.supply_chain_policy),
  trademark_compliance_level: chosen(values.trademark_compliance_level),
  manual_compliance_level: chosen(values.manual_compliance_level),
});

type PolicySectionProps = {
  workspaceId: string;
};

export default function PolicySection({ workspaceId }: PolicySectionProps) {
  // React Compiler 제외 — reset 뒤 필드 갱신 문제. → OperationSection 주석 참고
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_contract_policy");
  const { mutate: save, isPending, error, reset: clearSaveError } = useUpdateBrandContractPolicy(workspaceId);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isDirty },
  } = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: PolicyFormValues) => {
    save(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.brand_contract_policy) : values, { keepFieldsRef: true });
        Toast.success("계약 정책 정보를 저장했어요.");
      },
    });
  };

  // 라벨은 피그마(195:7686)와 스펙 설명 기준
  return (
    <SettingsSection
      title="계약 정책 정보"
      description="선호하는 계약 조건을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* row1 — 진출 희망 조건 (완성도 target_conditions) */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect
          control={control}
          name="preferred_contract_type"
          label="선호 계약 방식"
          options={toOptions(CONTRACT_TYPE_VALUES)}
        />
        <FormSelect
          control={control}
          name="target_country"
          label="진출 목표 국가"
          options={toOptions(TARGET_COUNTRY_VALUES)}
        />
      </div>

      {/* row2·3 — 운영 정책 (완성도 policy_conditions, 서버 필수) */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect
          control={control}
          name="exclusivity_level"
          label="독점권 요구 수준"
          required
          options={toOptions(EXCLUSIVITY_VALUES)}
        />
        <FormSelect
          control={control}
          name="menu_localization_level"
          label="메뉴 현지화 요구 수준"
          required
          options={toOptions(MENU_LOCALIZATION_VALUES)}
        />
        <FormSelect
          control={control}
          name="interior_standard_policy"
          label="인테리어 기준 선호"
          required
          options={toOptions(INTERIOR_STANDARD_VALUES)}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect
          control={control}
          name="supply_chain_policy"
          label="자체 식자재 공급망"
          required
          options={toOptions(SUPPLY_CHAIN_VALUES)}
        />
        <FormSelect
          control={control}
          name="trademark_compliance_level"
          label="상표 및 브랜드 사용 기준"
          required
          options={toOptions(TRADEMARK_COMPLIANCE_VALUES)}
        />
        <FormSelect
          control={control}
          name="manual_compliance_level"
          label="운영 매뉴얼 준수 수준"
          required
          options={toOptions(MANUAL_COMPLIANCE_VALUES)}
        />
      </div>
    </SettingsSection>
  );
}
