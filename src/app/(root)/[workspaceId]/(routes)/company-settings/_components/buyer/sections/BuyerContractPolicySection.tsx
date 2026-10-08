"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Toast } from "@components/ui";

import { useBuyerSection, useUpdateBuyerContractPolicy } from "@services/api/buyer/buyer.query";
import { type BuyerContractPolicyData, type UpdateBuyerContractPolicyRequest } from "@services/api/buyer/buyer.type";

import useClearOnFormChange from "../../../_hooks/useClearOnFormChange";
import FormSelect from "../../FormSelect";
import { pickOption, toOptions } from "../../sections/IntroOptions";
import { chosen, optionalChoice, requiredChoice } from "../../sections/formFields";
import {
  CONTRACT_TYPE_VALUES,
  EXCLUSIVITY_VALUES,
  INDUSTRY_VALUES,
  INTERIOR_VALUES,
  INVESTMENT_BUDGET_VALUES,
  LOCALIZATION_VALUES,
  PARTNER_ROLE_VALUES,
  PRICE_TIER_VALUES,
  ROYALTY_TYPE_VALUES,
  SUPPLY_CHAIN_VALUES,
} from "../buyerOptions";

/**
 * 계약 정책 정보 (피그마 961:10022) — PUT /buyer/contract-policy. 폼 필드 이름은 저장 DTO와 같다.
 *
 * 서버 필수는 선호 계약 방식을 뺀 9개다. 선호 계약 방식은 저장에서는 선택이지만 완성도는 필수로 센다 —
 * 저장은 막지 않고 저니 패널이 안내한다. 시안은 계약 방식을 여러 개 고르지만 API는 하나만 받는다.
 * 시안의 투자 규모는 USD지만 API는 원화 구간이라 API를 따른다. 상표·운영 매뉴얼 기준은 API에 없어 뺐다.
 */
const policySchema = z.object({
  target_industry: requiredChoice(INDUSTRY_VALUES),
  preferred_contract_type: optionalChoice(CONTRACT_TYPE_VALUES),
  target_partner_role: requiredChoice(PARTNER_ROLE_VALUES),
  investment_budget_scale: requiredChoice(INVESTMENT_BUDGET_VALUES),
  preferred_royalty_type: requiredChoice(ROYALTY_TYPE_VALUES),
  target_price_tier: requiredChoice(PRICE_TIER_VALUES),
  exclusivity_requirement: requiredChoice(EXCLUSIVITY_VALUES),
  localization_requirement: requiredChoice(LOCALIZATION_VALUES),
  interior_preference: requiredChoice(INTERIOR_VALUES),
  has_supply_chain: requiredChoice(SUPPLY_CHAIN_VALUES),
});

type PolicyFormValues = z.infer<typeof policySchema>;

const EMPTY_VALUES: PolicyFormValues = {
  target_industry: "",
  preferred_contract_type: "",
  target_partner_role: "",
  investment_budget_scale: "",
  preferred_royalty_type: "",
  target_price_tier: "",
  exclusivity_requirement: "",
  localization_requirement: "",
  interior_preference: "",
  has_supply_chain: "",
};

/** 저장값 → 폼. 선택지에 없는 값은 "선택 안 함"으로 → pickOption 주석 참고 */
const toFormValues = (saved: BuyerContractPolicyData): PolicyFormValues => ({
  target_industry: pickOption(INDUSTRY_VALUES, saved.target_industry),
  preferred_contract_type: pickOption(CONTRACT_TYPE_VALUES, saved.preferred_contract_type),
  target_partner_role: pickOption(PARTNER_ROLE_VALUES, saved.target_partner_role),
  investment_budget_scale: pickOption(INVESTMENT_BUDGET_VALUES, saved.investment_budget_scale),
  preferred_royalty_type: pickOption(ROYALTY_TYPE_VALUES, saved.preferred_royalty_type),
  target_price_tier: pickOption(PRICE_TIER_VALUES, saved.target_price_tier),
  exclusivity_requirement: pickOption(EXCLUSIVITY_VALUES, saved.exclusivity_requirement),
  localization_requirement: pickOption(LOCALIZATION_VALUES, saved.localization_requirement),
  interior_preference: pickOption(INTERIOR_VALUES, saved.interior_preference),
  has_supply_chain: pickOption(SUPPLY_CHAIN_VALUES, saved.has_supply_chain),
});

const toRequest = (values: PolicyFormValues): UpdateBuyerContractPolicyRequest => ({
  target_industry: chosen(values.target_industry),
  preferred_contract_type: values.preferred_contract_type || undefined,
  target_partner_role: chosen(values.target_partner_role),
  investment_budget_scale: chosen(values.investment_budget_scale),
  preferred_royalty_type: chosen(values.preferred_royalty_type),
  target_price_tier: chosen(values.target_price_tier),
  exclusivity_requirement: chosen(values.exclusivity_requirement),
  localization_requirement: chosen(values.localization_requirement),
  interior_preference: chosen(values.interior_preference),
  has_supply_chain: chosen(values.has_supply_chain),
});

/** 시안 순서대로 3열 — 업종·계약 방식·파트너 / 투자·로열티·가격대 / 독점·현지화·인테리어 / 공급망 */
const FIELDS: {
  name: keyof PolicyFormValues;
  label: string;
  values: readonly string[];
  required: boolean;
}[] = [
  { name: "target_industry", label: "도입 희망 업종", values: INDUSTRY_VALUES, required: true },
  { name: "preferred_contract_type", label: "선호 계약 방식", values: CONTRACT_TYPE_VALUES, required: false },
  { name: "target_partner_role", label: "희망 파트너 역할", values: PARTNER_ROLE_VALUES, required: true },
  { name: "investment_budget_scale", label: "초기 투자 가능 규모", values: INVESTMENT_BUDGET_VALUES, required: true },
  { name: "preferred_royalty_type", label: "선호 로열티 방식", values: ROYALTY_TYPE_VALUES, required: true },
  { name: "target_price_tier", label: "선호 가격대", values: PRICE_TIER_VALUES, required: true },
  { name: "exclusivity_requirement", label: "독점권 요구 수준", values: EXCLUSIVITY_VALUES, required: true },
  { name: "localization_requirement", label: "메뉴 현지화 요구 수준", values: LOCALIZATION_VALUES, required: true },
  { name: "interior_preference", label: "인테리어 기준 선호", values: INTERIOR_VALUES, required: true },
  { name: "has_supply_chain", label: "자체 식자재 공급망", values: SUPPLY_CHAIN_VALUES, required: true },
];

type BuyerContractPolicySectionProps = {
  workspaceId: string;
};

export default function BuyerContractPolicySection({ workspaceId }: BuyerContractPolicySectionProps) {
  // React Compiler 제외 → BasicInfoSection 주석 참고
  "use no memo";

  const { data: saved } = useBuyerSection(workspaceId, "buyer_contract_policy");
  const {
    mutate: updateBuyerContractPolicy,
    isPending,
    error,
    reset: clearSaveError,
  } = useUpdateBuyerContractPolicy(workspaceId);

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
    updateBuyerContractPolicy(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.buyer_contract_policy) : values, { keepFieldsRef: true });
        Toast.success("계약 정책 정보를 저장했어요.");
      },
    });
  };

  return (
    <SettingsSection
      title="계약 정책 정보"
      description="선호하는 계약 조건을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {FIELDS.map(field => (
          <FormSelect
            key={field.name}
            control={control}
            name={field.name}
            label={field.label}
            required={field.required}
            options={toOptions(field.values)}
          />
        ))}
      </div>
    </SettingsSection>
  );
}
