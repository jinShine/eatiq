"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandFee } from "@services/api/brand/brand.query";
import { type BrandFee, type UpdateFeeRequest } from "@services/api/brand/brand.type";

import FormSelect from "../FormSelect";
import SettingsSection from "../SettingsSection";
import { PAYMENT_CYCLE_OPTIONS, ROYALTY_BASE_OPTIONS } from "./policyOptions";

const numberField = z.string().refine(v => !v || /^\d+(\.\d+)?$/.test(v), { message: "숫자만 입력해주세요" });

const feeSchema = z.object({
  franchiseFeeKrw: numberField,
  royaltyBase: z.string(),
  royaltyRatePct: numberField,
  royaltyFixedKrw: numberField,
  paymentCycle: z.string(),
});

type FeeFormValues = z.infer<typeof feeSchema>;

const EMPTY_VALUES: FeeFormValues = {
  franchiseFeeKrw: "",
  royaltyBase: "",
  royaltyRatePct: "",
  royaltyFixedKrw: "",
  paymentCycle: "",
};

const toText = (v?: number | null) => (v === null || v === undefined ? "" : String(v));

const toFormValues = (fee: BrandFee): FeeFormValues => ({
  franchiseFeeKrw: toText(fee.franchiseFeeKrw),
  royaltyBase: fee.royaltyBase ?? "",
  royaltyRatePct: toText(fee.royaltyRatePct),
  royaltyFixedKrw: toText(fee.royaltyFixedKrw),
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
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FeeFormValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandFee ? toFormValues(settings.brandFee) : undefined,
  });

  const onSubmit = (values: FeeFormValues) => {
    const body: UpdateFeeRequest = {
      franchiseFeeKrw: toNumber(values.franchiseFeeKrw),
      royaltyBase: values.royaltyBase,
      royaltyRatePct: toNumber(values.royaltyRatePct),
      royaltyFixedKrw: toNumber(values.royaltyFixedKrw),
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
          placeholder="예: 5"
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
          placeholder="예: 30000000"
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
