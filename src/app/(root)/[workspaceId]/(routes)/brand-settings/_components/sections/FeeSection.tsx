"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandFee } from "@services/api/brand/brand.query";
import { type BrandFee, type UpdateFeeRequest } from "@services/api/brand/brand.type";

import FormSelect from "../FormSelect";
import SettingsSection from "../SettingsSection";
import { PAYMENT_CYCLE_OPTIONS, ROYALTY_BASE_OPTIONS } from "./policyOptions";

const numberField = z.string().refine(v => !v || /^\d+(\.\d+)?$/.test(v), { message: "숫자만 입력해주세요" });

// PATCH /api/brands/{brandId}/fee — 전체 치환 (franchise 유형 전용)
// 서버 제약: brandType이 franchise가 아니면 요청 내용과 무관하게 400
// 서버 제약: royaltyBase가 활성 로열티 필드를 결정하고, 비활성 필드를 보내면 400
//   revenue_pct → royaltyRatePct만 / fixed → royaltyFixedKrw만 / 미선택 → 둘 다 보낼 수 없음
const feeSchema = z.object({
  franchiseFeeKrw: numberField, // 가맹비 (원) · 서버는 변환 없이 원 단위로 보관
  royaltyBase: z.string(), // 로열티 산정 기준 · royalty_base(revenue_pct/fixed)
  royaltyRatePct: numberField, // 매출 대비 로열티 비율 (%) · 소수 허용(5.5 그대로 저장)
  royaltyFixedKrw: numberField, // 고정 로열티 금액 (원)
  paymentCycle: z.string(), // 정산 주기 · payment_cycle(monthly/quarterly/annual)
});

const ROYALTY_BASE = { rate: "revenue_pct", fixed: "fixed" } as const;

type FeeFormValues = z.infer<typeof feeSchema>;

const EMPTY_VALUES: FeeFormValues = {
  franchiseFeeKrw: "",
  royaltyBase: "",
  royaltyRatePct: "",
  royaltyFixedKrw: "",
  paymentCycle: "",
};

const toText = (v?: number | null) => (v === null || v === undefined ? "" : String(v));

// 서버가 royaltyBase 전환 시 비활성 필드를 지우지 않으므로(정률/정액 값이 동시에 남는다)
// 화면에는 현재 기준에 해당하는 값만 노출한다
const toFormValues = (fee: BrandFee): FeeFormValues => ({
  franchiseFeeKrw: toText(fee.franchiseFeeKrw),
  royaltyBase: fee.royaltyBase ?? "",
  royaltyRatePct: fee.royaltyBase === ROYALTY_BASE.rate ? toText(fee.royaltyRatePct) : "",
  royaltyFixedKrw: fee.royaltyBase === ROYALTY_BASE.fixed ? toText(fee.royaltyFixedKrw) : "",
  paymentCycle: fee.paymentCycle ?? "",
});

const toNumber = (v: string) => (v ? Number(v) : undefined);

const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type FeeSectionProps = {
  workspaceId: string;
};

export default function FeeSection({ workspaceId }: FeeSectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateBrandFee, isPending } = useUpdateBrandFee(workspaceId);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FeeFormValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandFee ? toFormValues(settings.brandFee) : undefined,
  });

  // royaltyBase가 어느 로열티 필드를 쓸지 결정한다 (파생 상태이므로 별도 state로 두지 않는다)
  const royaltyBase = useWatch({ control, name: "royaltyBase" });
  const isRateActive = royaltyBase === ROYALTY_BASE.rate;
  const isFixedActive = royaltyBase === ROYALTY_BASE.fixed;

  // 기준을 바꾸면 비활성 필드에 남은 값을 비운다 (disabled 칸에 이전 값이 보이는 것을 방지)
  useEffect(() => {
    if (!isRateActive) {
      setValue("royaltyRatePct", "");
    }
    if (!isFixedActive) {
      setValue("royaltyFixedKrw", "");
    }
  }, [isRateActive, isFixedActive, setValue]);

  const onSubmit = (values: FeeFormValues) => {
    // 비활성 로열티 필드는 body에서 제외한다 (undefined는 JSON 직렬화 시 키 자체가 빠진다)
    const body: UpdateFeeRequest = {
      franchiseFeeKrw: toNumber(values.franchiseFeeKrw),
      royaltyBase: values.royaltyBase,
      royaltyRatePct: isRateActive ? toNumber(values.royaltyRatePct) : undefined,
      royaltyFixedKrw: isFixedActive ? toNumber(values.royaltyFixedKrw) : undefined,
      paymentCycle: values.paymentCycle,
    };

    updateBrandFee(body, {
      onSuccess: () => Toast.success("수수료 및 정산 정책을 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="수수료 및 정산 정책 정보"
      description="선호하는 수수료 조건을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="franchiseFeeKrw"
          size="md"
          labelClassName="text-xs"
          label="가맹비 (원화 기준)"
          placeholder="미등록"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>원</Unit>}
          error={Boolean(errors.franchiseFeeKrw)}
          errorText={errors.franchiseFeeKrw?.message}
          {...register("franchiseFeeKrw")}
        />
        <FormSelect
          control={control}
          name="royaltyBase"
          label="매출 대비 로열티 산정 기준"
          options={ROYALTY_BASE_OPTIONS}
        />
        <Input
          id="royaltyRatePct"
          size="md"
          labelClassName="text-xs"
          label="매출 대비 로열티 비율"
          placeholder={isRateActive ? "예: 5" : "매출 비율 기준 선택 시 입력"}
          disabled={!isRateActive}
          inputMode="decimal"
          className="pr-10"
          endAdornment={<Unit>%</Unit>}
          error={Boolean(errors.royaltyRatePct)}
          errorText={errors.royaltyRatePct?.message}
          {...register("royaltyRatePct")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="royaltyFixedKrw"
          size="md"
          labelClassName="text-xs"
          label="고정 로열티 금액 (원화 기준)"
          placeholder={isFixedActive ? "예: 30000000" : "고정 금액 기준 선택 시 입력"}
          disabled={!isFixedActive}
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>원</Unit>}
          error={Boolean(errors.royaltyFixedKrw)}
          errorText={errors.royaltyFixedKrw?.message}
          {...register("royaltyFixedKrw")}
        />
        <FormSelect control={control} name="paymentCycle" label="지급 주기" options={PAYMENT_CYCLE_OPTIONS} />
      </div>
    </SettingsSection>
  );
}
