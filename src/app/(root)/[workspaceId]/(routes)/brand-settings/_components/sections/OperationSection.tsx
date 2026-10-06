import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { CommaNumberInput, Input, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandStatus } from "@services/api/brand/brand.query";
import { type BrandStatusData, type UpdateBrandStatusRequest } from "@services/api/brand/brand.type";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import FormMultiSelect, { toTags } from "../FormMultiSelect";
import { TARGET_AUDIENCE_VALUES, USAGE_CONTEXT_VALUES, toOptions } from "./IntroOptions";
import { toNumberText } from "./numberText";

/**
 * 폼 필드 이름은 저장 DTO(UpdateBrandStatusDto)와 같다. → BasicInfoSection 주석 참고
 *
 * 숫자 7개는 모두 서버 필수(0 이상)다. 입력은 문자열로 받아 저장할 때 숫자로 바꾼다.
 * 매장 수·좌석 수는 서버가 정수만 받는다. 매출·객단가는 원 단위 정수로 받는다(서버는 소수도 받지만 원 미만은 없다).
 * 평형만 소수를 허용한다.
 */
const REQUIRED = "입력해주세요";

/**
 * 입력 상한. 서버 범위(-1조~1조, 2026-10-06)가 너무 넓어 화면에서 막는다.
 * 값은 2026-10-04 확정. 매출만 서버 상한(1조)에 맞춰 낮췄다 — 넘기면 저장이 실패한다.
 */
const MAX = {
  storeCount: { value: 100_000, label: "10만 개" },
  monthlySales: { value: 1_000_000_000_000, label: "1조 원" },
  costPerCustomer: { value: 100_000_000, label: "1억 원" },
  storeArea: { value: 10_000, label: "1만 평" },
  seatCount: { value: 10_000, label: "1만 석" },
} as const;

type Limit = (typeof MAX)[keyof typeof MAX];

// 형식 검사가 실패한 값은 상한 검사를 건너뛴다(zod 3은 앞 검사가 실패해도 refine을 돌린다)
const withinLimit = (pattern: RegExp, { value, label }: Limit) =>
  [(input: string) => !pattern.test(input) || Number(input) <= value, `${label} 이하로 입력해주세요`] as const;

const INTEGER = /^\d+$/;
const DECIMAL = /^\d+(\.\d+)?$/;

const integerField = (limit: Limit) =>
  z
    .string()
    .min(1, REQUIRED)
    .regex(INTEGER, "0 이상의 정수를 입력해주세요")
    .refine(...withinLimit(INTEGER, limit));
const decimalField = (limit: Limit) =>
  z
    .string()
    .min(1, REQUIRED)
    .regex(DECIMAL, "0 이상의 숫자를 입력해주세요")
    .refine(...withinLimit(DECIMAL, limit));

const statusSchema = z
  .object({
    domestic_store_total_cnt: integerField(MAX.storeCount),
    domestic_store_direct_cnt: integerField(MAX.storeCount),
    overseas_store_total_cnt: integerField(MAX.storeCount),
    avg_monthly_sales: integerField(MAX.monthlySales), // 원
    avg_cost_per_customer: integerField(MAX.costPerCustomer), // 원
    avg_store_area: decimalField(MAX.storeArea), // 평
    avg_seat_cnt: integerField(MAX.seatCount),
    // 10개 제한은 시안 기준이다. 서버는 개수를 제한하지 않는다
    target_audience: z.array(z.string()).max(10, "최대 10개까지 선택할 수 있어요"),
    usage_context: z.array(z.string()).max(10, "최대 10개까지 선택할 수 있어요"),
  })
  // 서버는 검사하지 않지만 직영점이 전체보다 많을 수는 없다.
  // 두 칸이 모두 숫자일 때만 비교한다 — zod 3은 다른 칸이 실패해도 refine을 돌려서,
  // 전체가 빈칸이면 0으로 계산돼 엉뚱하게 이 문구까지 뜬다
  .refine(
    ({ domestic_store_direct_cnt: direct, domestic_store_total_cnt: total }) =>
      !/^\d+$/.test(direct) || !/^\d+$/.test(total) || Number(direct) <= Number(total),
    {
      path: ["domestic_store_direct_cnt"],
      message: "국내 전체 매장 수보다 많을 수 없어요",
    },
  );

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

const toFormValues = (saved: BrandStatusData): StatusFormValues => ({
  domestic_store_total_cnt: toNumberText(saved.domestic_store_total_cnt),
  domestic_store_direct_cnt: toNumberText(saved.domestic_store_direct_cnt),
  overseas_store_total_cnt: toNumberText(saved.overseas_store_total_cnt),
  avg_monthly_sales: toNumberText(saved.avg_monthly_sales),
  avg_cost_per_customer: toNumberText(saved.avg_cost_per_customer),
  avg_store_area: toNumberText(saved.avg_store_area),
  avg_seat_cnt: toNumberText(saved.avg_seat_cnt),
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

// 단위 표시 (input 우측)
const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type OperationSectionProps = {
  workspaceId: string;
};

export default function OperationSection({ workspaceId }: OperationSectionProps) {
  // React Compiler 제외. RHF는 렌더마다 register()가 다시 불려 "화면에 있는 필드" 목록을 채우는 걸 전제한다.
  // 컴파일러가 register() 결과를 메모하면 reset 뒤 그 목록이 빈 채로 남아, 다음 reset이 입력칸을 갱신하지 못한다
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_status");
  const { mutate: updateBrandStatus, isPending, error, reset: clearSaveError } = useUpdateBrandStatus(workspaceId);

  const {
    register,
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: StatusFormValues) => {
    updateBrandStatus(toRequest(values), {
      onSuccess: response => {
        // 서버가 저장한 모양으로 폼을 맞춘다(목 모드는 보낸 값). 이걸 해야 dirty가 풀린다.
        // keepFieldsRef: 필드 ref를 유지한 채 입력칸 값을 직접 바꾼다(values prop 경로와 같은 방식)
        reset(response ? toFormValues(response.brand_status) : values, { keepFieldsRef: true });
        Toast.success("운영 현황을 저장했어요.");
      },
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
          // 전체가 바뀌면 직영점 칸의 "많을 수 없어요"도 다시 검사한다(오류는 직영점 칸에 붙어 있다)
          {...register("domestic_store_total_cnt", { deps: ["domestic_store_direct_cnt"] })}
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
