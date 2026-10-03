import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { CommaNumberInput, Input, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandStatus } from "@services/api/brand/brand.query";
import { type BrandStatusData, type UpdateBrandStatusRequest } from "@services/api/brand/brand.type";

import FormMultiSelect from "../FormMultiSelect";
import { TARGET_AUDIENCE_VALUES, USAGE_CONTEXT_VALUES } from "./IntroOptions";

/**
 * 폼 필드 이름은 저장 DTO(UpdateBrandStatusDto)와 같다. → BasicInfoSection 주석 참고
 *
 * 숫자 7개는 모두 서버 필수(0 이상)다. 입력은 문자열로 받아 저장할 때 숫자로 바꾼다.
 * 매장 수·좌석 수는 서버가 정수만 받는다. 매출·객단가는 원 단위 정수로 받는다(서버는 소수도 받지만 원 미만은 없다).
 * 평형만 소수를 허용한다.
 */
const REQUIRED = "입력해주세요";
const integerField = z.string().min(1, REQUIRED).regex(/^\d+$/, "0 이상의 정수를 입력해주세요");
const decimalField = z
  .string()
  .min(1, REQUIRED)
  .regex(/^\d+(\.\d+)?$/, "0 이상의 숫자를 입력해주세요");

const statusSchema = z
  .object({
    domestic_store_total_cnt: integerField,
    domestic_store_direct_cnt: integerField,
    overseas_store_total_cnt: integerField,
    avg_monthly_sales: integerField, // 원
    avg_cost_per_customer: integerField, // 원
    avg_store_area: decimalField, // 평
    avg_seat_cnt: integerField,
    // 10개 제한은 시안 기준이다. 서버는 개수를 제한하지 않는다
    target_audience: z.array(z.string()).max(10, "최대 10개까지 선택할 수 있어요"),
    usage_context: z.array(z.string()).max(10, "최대 10개까지 선택할 수 있어요"),
  })
  // 서버는 검사하지 않지만 직영점이 전체보다 많을 수는 없다
  .refine(v => Number(v.domestic_store_direct_cnt) <= Number(v.domestic_store_total_cnt), {
    path: ["domestic_store_direct_cnt"],
    message: "국내 전체 매장 수보다 많을 수 없어요",
  });

type StatusFormValues = z.infer<typeof statusSchema>;

const EMPTY_VALUES: StatusFormValues = {
  domestic_store_total_cnt: "",
  domestic_store_direct_cnt: "",
  overseas_store_total_cnt: "",
  avg_monthly_sales: "",
  avg_cost_per_customer: "",
  avg_store_area: "",
  avg_seat_cnt: "",
  target_audience: [],
  usage_context: [],
};

const toText = (value?: number | null) => (value === null || value === undefined ? "" : String(value));

/** 빈 문자열 항목은 버린다. 서버가 받아주지만 선택지에 없어 화면에 안 보인 채 다시 저장된다 */
const toTags = (values?: string[] | null) => (values ?? []).filter(value => value.trim());

const toFormValues = (saved: BrandStatusData): StatusFormValues => ({
  domestic_store_total_cnt: toText(saved.domestic_store_total_cnt),
  domestic_store_direct_cnt: toText(saved.domestic_store_direct_cnt),
  overseas_store_total_cnt: toText(saved.overseas_store_total_cnt),
  avg_monthly_sales: toText(saved.avg_monthly_sales),
  avg_cost_per_customer: toText(saved.avg_cost_per_customer),
  avg_store_area: toText(saved.avg_store_area),
  avg_seat_cnt: toText(saved.avg_seat_cnt),
  target_audience: toTags(saved.target_audience),
  usage_context: toTags(saved.usage_context),
});

const toRequest = (values: StatusFormValues): UpdateBrandStatusRequest => ({
  domestic_store_total_cnt: Number(values.domestic_store_total_cnt),
  domestic_store_direct_cnt: Number(values.domestic_store_direct_cnt),
  overseas_store_total_cnt: Number(values.overseas_store_total_cnt),
  avg_monthly_sales: Number(values.avg_monthly_sales),
  avg_cost_per_customer: Number(values.avg_cost_per_customer),
  avg_store_area: Number(values.avg_store_area),
  avg_seat_cnt: Number(values.avg_seat_cnt),
  target_audience: values.target_audience,
  usage_context: values.usage_context,
});

const toOptions = (values: readonly string[]) => values.map(value => ({ value, label: value }));

// 단위 표시 (input 우측)
const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type OperationSectionProps = {
  workspaceId: string;
};

export default function OperationSection({ workspaceId }: OperationSectionProps) {
  const { data: saved } = useBrandSection(workspaceId, "brand_status");
  const { mutate: updateBrandStatus, isPending, error } = useUpdateBrandStatus(workspaceId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  const onSubmit = (values: StatusFormValues) => {
    updateBrandStatus(toRequest(values), {
      onSuccess: () => Toast.success("운영 현황을 저장했어요."),
    });
  };

  return (
    <SettingsSection
      title="운영 현황"
      description="브랜드의 매장, 매출 현황을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* row1 — 매장 수 3열 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="domestic_store_total_cnt"
          size="md"
          labelClassName="text-xs"
          label="국내 전체 매장 수"
          required
          placeholder="예: 187"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>개</Unit>}
          error={Boolean(errors.domestic_store_total_cnt)}
          errorText={errors.domestic_store_total_cnt?.message}
          {...register("domestic_store_total_cnt")}
        />
        <Input
          id="domestic_store_direct_cnt"
          size="md"
          labelClassName="text-xs"
          label="국내 직영점 수"
          required
          placeholder="예: 12"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>개</Unit>}
          error={Boolean(errors.domestic_store_direct_cnt)}
          errorText={errors.domestic_store_direct_cnt?.message}
          {...register("domestic_store_direct_cnt")}
        />
        <Input
          id="overseas_store_total_cnt"
          size="md"
          labelClassName="text-xs"
          label="해외 전체 매장 수"
          required
          placeholder="예: 3"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>개</Unit>}
          error={Boolean(errors.overseas_store_total_cnt)}
          errorText={errors.overseas_store_total_cnt?.message}
          {...register("overseas_store_total_cnt")}
        />
      </div>

      {/* row2 — 매출·규모 4열 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {/* 금액은 원 단위. 포커스가 없을 때 쉼표로 끊어 보여준다 */}
        <Controller
          name="avg_monthly_sales"
          control={control}
          render={({ field }) => (
            <CommaNumberInput
              id="avg_monthly_sales"
              size="md"
              labelClassName="text-xs"
              label="월평균 매출"
              required
              placeholder="예: 42,000,000"
              className="pr-10"
              endAdornment={<Unit>원</Unit>}
              error={Boolean(errors.avg_monthly_sales)}
              errorText={errors.avg_monthly_sales?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="avg_cost_per_customer"
          control={control}
          render={({ field }) => (
            <CommaNumberInput
              id="avg_cost_per_customer"
              size="md"
              labelClassName="text-xs"
              label="평균 객단가"
              required
              placeholder="예: 13,500"
              className="pr-10"
              endAdornment={<Unit>원</Unit>}
              error={Boolean(errors.avg_cost_per_customer)}
              errorText={errors.avg_cost_per_customer?.message}
              {...field}
            />
          )}
        />
        <Input
          id="avg_store_area"
          size="md"
          labelClassName="text-xs"
          label="평균 매장 평형"
          required
          placeholder="예: 28"
          inputMode="decimal"
          className="pr-10"
          endAdornment={<Unit>평</Unit>}
          error={Boolean(errors.avg_store_area)}
          errorText={errors.avg_store_area?.message}
          {...register("avg_store_area")}
        />
        <Input
          id="avg_seat_cnt"
          size="md"
          labelClassName="text-xs"
          label="평균 좌석 수"
          required
          placeholder="예: 42"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>석</Unit>}
          error={Boolean(errors.avg_seat_cnt)}
          errorText={errors.avg_seat_cnt?.message}
          {...register("avg_seat_cnt")}
        />
      </div>

      {/* row3 — 주요 고객층 · 주 이용 상황 (2열) */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormMultiSelect
          control={control}
          name="target_audience"
          label="주요 고객층"
          placeholder="고객층을 선택해주세요"
          options={toOptions(TARGET_AUDIENCE_VALUES)}
        />
        <FormMultiSelect
          control={control}
          name="usage_context"
          label="주 이용 상황"
          placeholder="이용 상황을 선택해주세요"
          options={toOptions(USAGE_CONTEXT_VALUES)}
        />
      </div>
    </SettingsSection>
  );
}
