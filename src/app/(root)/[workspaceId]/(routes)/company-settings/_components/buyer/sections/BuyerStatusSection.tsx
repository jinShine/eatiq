"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Input, Toast } from "@components/ui";

import { useBuyerSection, useUpdateBuyerStatus } from "@services/api/buyer/buyer.query";
import { type BuyerStatusData, type UpdateBuyerStatusBody } from "@services/api/buyer/buyer.type";

import useClearOnFormChange from "../../../_hooks/useClearOnFormChange";
import FormMultiSelect, { toTags } from "../../FormMultiSelect";
import FormSelect from "../../FormSelect";
import { pickOption, toOptions } from "../../sections/IntroOptions";
import { INTEGER, REQUIRED, chosen, optionalChoice, requiredChoice } from "../../sections/formFields";
import { toNumberText } from "../../sections/numberText";
import { ANNUAL_REVENUE_VALUES, BRAND_EXPERIENCE_VALUES, INDUSTRY_VALUES } from "../buyerOptions";

/**
 * 현재 운영 현황 (피그마 961:10022) — PUT /buyer/status. 폼 필드 이름은 저장 DTO와 같다 → BasicInfoSection 주석 참고.
 *
 * 서버 필수: 업종·매장 수(0 이상 정수)·연매출 규모·브랜드 운영 경험(빈 배열 허용).
 * 시안의 연매출은 USD 구간·하한·상한이지만 API는 원화 구간 하나라 API를 따른다(디자인 확인 요청).
 *
 * 한국 브랜드 운영 경험·보유 브랜드 수는 시안에 칸이 없지만 기획 확인 결과 필요해서(2026-10-08) 연매출 옆에 둔다.
 * 둘 다 선택 항목이다. 이 두 필드는 보내지 않으면 서버가 기존 값을 그대로 둬서, 비울 때는 null을 보낸다
 * (→ UpdateBuyerStatusBody 주석).
 */
// 매장 수·브랜드 수 상한 — 서버에 상한이 없어 브랜드 운영 현황과 같은 기준으로 막는다
const MAX_COUNT = { value: 100_000, label: "10만 개" };

const countField = () =>
  z
    .string()
    .regex(INTEGER, "0 이상의 정수를 입력해주세요")
    .refine(
      value => !INTEGER.test(value) || Number(value) <= MAX_COUNT.value,
      `${MAX_COUNT.label} 이하로 입력해주세요`,
    );

/** 예/아니오 선택 박스 ↔ boolean. 선택 박스 값은 문자열이라 이름을 붙여 둔다 */
const YES_NO_OPTIONS = [
  { value: "yes", label: "예" },
  { value: "no", label: "아니오" },
] as const;

const statusSchema = z.object({
  current_industry: requiredChoice(INDUSTRY_VALUES),
  store_cnt: z.string().min(1, REQUIRED).pipe(countField()),
  brand_experience_types: z.array(z.enum(BRAND_EXPERIENCE_VALUES)),
  annual_revenue_scale: requiredChoice(ANNUAL_REVENUE_VALUES),
  korean_brand_experience: optionalChoice(["yes", "no"] as const),
  // 비워 둘 수 있다
  brand_count: z.union([z.literal(""), countField()]),
});

type StatusFormValues = z.infer<typeof statusSchema>;

const EMPTY_VALUES: StatusFormValues = {
  current_industry: "",
  store_cnt: "",
  brand_experience_types: [],
  annual_revenue_scale: "",
  korean_brand_experience: "",
  brand_count: "",
};

const toFormValues = (saved: BuyerStatusData): StatusFormValues => ({
  current_industry: pickOption(INDUSTRY_VALUES, saved.current_industry),
  store_cnt: toNumberText(saved.store_cnt),
  // 선택지에 없는 값은 버린다 → pickOption 주석 참고
  brand_experience_types: toTags(saved.brand_experience_types).filter(
    (value): value is (typeof BRAND_EXPERIENCE_VALUES)[number] =>
      (BRAND_EXPERIENCE_VALUES as readonly string[]).includes(value),
  ),
  annual_revenue_scale: pickOption(ANNUAL_REVENUE_VALUES, saved.annual_revenue_scale),
  korean_brand_experience:
    saved.korean_brand_experience === undefined || saved.korean_brand_experience === null
      ? ""
      : saved.korean_brand_experience
        ? "yes"
        : "no",
  brand_count: toNumberText(saved.brand_count),
});

const toRequest = (values: StatusFormValues): UpdateBuyerStatusBody => ({
  current_industry: chosen(values.current_industry),
  store_cnt: Number(values.store_cnt),
  brand_experience_types: values.brand_experience_types,
  annual_revenue_scale: chosen(values.annual_revenue_scale),
  korean_brand_experience: values.korean_brand_experience ? values.korean_brand_experience === "yes" : null,
  brand_count: values.brand_count ? Number(values.brand_count) : null,
});

type BuyerStatusSectionProps = {
  workspaceId: string;
};

export default function BuyerStatusSection({ workspaceId }: BuyerStatusSectionProps) {
  // React Compiler 제외 → BasicInfoSection 주석 참고
  "use no memo";

  const { data: saved } = useBuyerSection(workspaceId, "buyer_status");
  const { mutate: updateBuyerStatus, isPending, error, reset: clearSaveError } = useUpdateBuyerStatus(workspaceId);

  const {
    control,
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: StatusFormValues) => {
    updateBuyerStatus(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.buyer_status) : values, { keepFieldsRef: true });
        Toast.success("운영 현황을 저장했어요.");
      },
    });
  };

  return (
    <SettingsSection
      title="현재 운영 현황"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect
          control={control}
          name="current_industry"
          label="현재 운영 중인 업종"
          required
          options={toOptions(INDUSTRY_VALUES)}
        />
        <Input
          id="store_cnt"
          size="md"
          labelClassName="text-xs"
          label="운영 매장 수"
          required
          placeholder="예: 12"
          inputMode="numeric"
          error={Boolean(errors.store_cnt)}
          errorText={errors.store_cnt?.message}
          {...register("store_cnt")}
        />
        <FormMultiSelect
          control={control}
          name="brand_experience_types"
          label="브랜드 운영 경험"
          placeholder="운영 경험을 선택해주세요"
          options={toOptions(BRAND_EXPERIENCE_VALUES)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect
          control={control}
          name="annual_revenue_scale"
          label="연매출 규모"
          required
          options={toOptions(ANNUAL_REVENUE_VALUES)}
        />
        <FormSelect
          control={control}
          name="korean_brand_experience"
          label="한국 브랜드 운영 경험"
          options={YES_NO_OPTIONS}
        />
        <Input
          id="brand_count"
          size="md"
          labelClassName="text-xs"
          label="보유 브랜드 수"
          placeholder="예: 8"
          inputMode="numeric"
          error={Boolean(errors.brand_count)}
          errorText={errors.brand_count?.message}
          {...register("brand_count")}
        />
      </div>
    </SettingsSection>
  );
}
