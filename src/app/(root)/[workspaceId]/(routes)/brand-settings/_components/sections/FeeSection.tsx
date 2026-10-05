"use client";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { CommaNumberInput, Input, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandCommission } from "@services/api/brand/brand.query";
import { type BrandCommissionData, type UpdateBrandCommissionRequest } from "@services/api/brand/brand.type";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import FormSelect from "../FormSelect";
import { pickOption, toOptions } from "./IntroOptions";
import { toNumberText } from "./numberText";
import { ROYALTY_CALC_BASE_VALUES, ROYALTY_PAYMENT_CYCLE_VALUES } from "./policyOptions";

/**
 * 수수료 및 정산 정책 정보 — PUT /commission. 폼 필드 이름은 저장 DTO와 같다. → BasicInfoSection 주석 참고
 *
 * 서버 규칙(400 응답으로 확인): 5개 모두 필수, 금액은 0 이상, 로열티 비율은 0~100%.
 * 산정 기준(총매출·순매출)은 로열티 비율을 어느 매출에 곱할지이고, 비율과 고정 금액은 둘 다 받는다.
 * (예전 API는 산정 기준이 "비율/정액" 중 하나를 골라 한쪽 칸만 썼다 — 그 처리는 없앴다)
 */
const REQUIRED = "입력해주세요";
const SELECT_REQUIRED = "선택해주세요";

// 금액 상한 — 서버에 상한이 없다. 운영 현황 매출과 같은 기준(10조 원). TODO(백엔드): 서버 상한이 정해지면 맞춘다
const MAX_WON = { value: 10_000_000_000_000, label: "10조 원" };

const INTEGER = /^\d+$/;
const PERCENT = /^\d+(\.\d{1,2})?$/;

const wonField = z
  .string()
  .min(1, REQUIRED)
  .regex(INTEGER, "0 이상의 정수를 입력해주세요")
  .refine(value => !INTEGER.test(value) || Number(value) <= MAX_WON.value, `${MAX_WON.label} 이하로 입력해주세요`);

const choice = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .union([z.enum(values), z.literal("")], { errorMap: () => ({ message: "목록에서 다시 선택해주세요" }) })
    .refine(value => value !== "", SELECT_REQUIRED);

const commissionSchema = z.object({
  franchise_fee: wonField,
  royalty_calc_base: choice(ROYALTY_CALC_BASE_VALUES),
  royalty_rate: z
    .string()
    .min(1, REQUIRED)
    .regex(PERCENT, "소수 둘째 자리까지 숫자로 입력해주세요")
    .refine(value => !PERCENT.test(value) || Number(value) <= 100, "100% 이하로 입력해주세요"),
  fixed_royalty: wonField,
  royalty_payment_cycle: choice(ROYALTY_PAYMENT_CYCLE_VALUES),
});

type CommissionFormValues = z.infer<typeof commissionSchema>;

const EMPTY_VALUES: CommissionFormValues = {
  franchise_fee: "",
  royalty_calc_base: "",
  royalty_rate: "",
  fixed_royalty: "",
  royalty_payment_cycle: "",
};

const toFormValues = (saved: BrandCommissionData): CommissionFormValues => ({
  franchise_fee: toNumberText(saved.franchise_fee),
  royalty_calc_base: pickOption(ROYALTY_CALC_BASE_VALUES, saved.royalty_calc_base),
  royalty_rate: toNumberText(saved.royalty_rate),
  fixed_royalty: toNumberText(saved.fixed_royalty),
  royalty_payment_cycle: pickOption(ROYALTY_PAYMENT_CYCLE_VALUES, saved.royalty_payment_cycle),
});

/** 필수 선택은 검증을 통과했으면 빈 값이 아니다 */
const chosen = <T extends string>(value: T | "") => value as T;

const toRequest = (values: CommissionFormValues): UpdateBrandCommissionRequest => ({
  franchise_fee: Number(values.franchise_fee),
  royalty_calc_base: chosen(values.royalty_calc_base),
  royalty_rate: Number(values.royalty_rate),
  fixed_royalty: Number(values.fixed_royalty),
  royalty_payment_cycle: chosen(values.royalty_payment_cycle),
});

const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type FeeSectionProps = {
  workspaceId: string;
};

export default function FeeSection({ workspaceId }: FeeSectionProps) {
  // React Compiler 제외 — reset 뒤 필드 갱신 문제. → OperationSection 주석 참고
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_commission");
  const { mutate: save, isPending, error, reset: clearSaveError } = useUpdateBrandCommission(workspaceId);

  const {
    register,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: CommissionFormValues) => {
    save(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.brand_commission) : values, { keepFieldsRef: true });
        Toast.success("수수료 및 정산 정책을 저장했어요.");
      },
    });
  };

  // 배치·라벨은 피그마(195:7754) 기준
  return (
    <SettingsSection
      title="수수료 및 정산 정책 정보"
      description="선호하는 수수료 조건을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Controller
          name="franchise_fee"
          control={control}
          render={({ field }) => (
            <CommaNumberInput
              id="franchise_fee"
              size="md"
              labelClassName="text-xs"
              label="가맹비 (원화 기준)"
              required
              placeholder="예: 50,000,000"
              className="pr-10"
              endAdornment={<Unit>원</Unit>}
              error={Boolean(errors.franchise_fee)}
              errorText={errors.franchise_fee?.message}
              {...field}
            />
          )}
        />
        <FormSelect
          control={control}
          name="royalty_calc_base"
          label="매출 대비 로열티 산정 기준"
          required
          options={toOptions(ROYALTY_CALC_BASE_VALUES)}
        />
        <Input
          id="royalty_rate"
          size="md"
          labelClassName="text-xs"
          label="매출 대비 로열티 비율"
          required
          placeholder="예: 5"
          inputMode="decimal"
          className="pr-10"
          endAdornment={<Unit>%</Unit>}
          error={Boolean(errors.royalty_rate)}
          errorText={errors.royalty_rate?.message}
          {...register("royalty_rate")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Controller
          name="fixed_royalty"
          control={control}
          render={({ field }) => (
            <CommaNumberInput
              id="fixed_royalty"
              size="md"
              labelClassName="text-xs"
              label="고정 로열티 금액 (원화 기준)"
              required
              placeholder="예: 30,000,000"
              className="pr-10"
              endAdornment={<Unit>원</Unit>}
              error={Boolean(errors.fixed_royalty)}
              errorText={errors.fixed_royalty?.message}
              {...field}
            />
          )}
        />
        <FormSelect
          control={control}
          name="royalty_payment_cycle"
          label="지급 주기"
          required
          options={toOptions(ROYALTY_PAYMENT_CYCLE_VALUES)}
        />
      </div>
    </SettingsSection>
  );
}
