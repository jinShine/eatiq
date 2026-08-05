import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandOperation } from "@services/api/brand/brand.query";
import { type BrandOperation, type UpdateOperationRequest } from "@services/api/brand/brand.type";

import FormMultiSelect from "../FormMultiSelect";
import SettingsSection from "../SettingsSection";
import { TARGET_CUSTOMER_OPTIONS, USAGE_OCCASION_OPTIONS } from "./IntroOptions";

// 숫자 입력은 문자열로 다루고 제출 시 변환 — 빈칸/0 구분을 위해
const numberField = z.string().refine(v => !v || /^\d+$/.test(v), { message: "숫자만 입력해주세요" });

// PATCH /api/brands/{brandId}/operation — 전체 치환
const operationSchema = z.object({
  storeCountTotalDomestic: numberField, // 국내 전체 매장 수 (개)
  storeCountDirect: numberField, // 국내 직영점 수 (개)
  storeCountOverseas: numberField, // 해외 전체 매장 수 (개)
  monthlyRevenueAvg: numberField, // 월평균 매출 (만원) · TODO(백엔드) 단위 확인
  avgSpendPerPerson: numberField, // 평균 객단가 (원)
  avgStoreSizePy: numberField, // 평균 매장 평형 (평)
  avgSeatCount: numberField, // 평균 좌석 수 (석)
  targetCustomers: z.array(z.string()).max(10, "최대 10개까지 선택할 수 있어요"), // 주요 고객층 · 다중, 코드값 배열
  usageOccasions: z.array(z.string()).max(10, "최대 10개까지 선택할 수 있어요"), // 주 이용 상황 · 다중, 코드값 배열
});

type OperationFormValues = z.infer<typeof operationSchema>;

const EMPTY_VALUES: OperationFormValues = {
  storeCountTotalDomestic: "",
  storeCountDirect: "",
  storeCountOverseas: "",
  monthlyRevenueAvg: "",
  avgSpendPerPerson: "",
  avgStoreSizePy: "",
  avgSeatCount: "",
  targetCustomers: [],
  usageOccasions: [],
};

const toText = (v?: number | null) => (v === null || v === undefined ? "" : String(v));

const toFormValues = (operation: BrandOperation): OperationFormValues => ({
  storeCountTotalDomestic: toText(operation.storeCountTotalDomestic),
  storeCountDirect: toText(operation.storeCountDirect),
  storeCountOverseas: toText(operation.storeCountOverseas),
  monthlyRevenueAvg: toText(operation.monthlyRevenueAvg),
  avgSpendPerPerson: toText(operation.avgSpendPerPerson),
  avgStoreSizePy: toText(operation.avgStoreSizePy),
  avgSeatCount: toText(operation.avgSeatCount),
  targetCustomers: operation.targetCustomers ?? [],
  usageOccasions: operation.usageOccasions ?? [],
});

const toNumber = (v: string) => (v ? Number(v) : undefined);

// TODO(백엔드): monthlyRevenueAvg 단위 확인 필요 (화면은 만원 기준)
const toRequest = (values: OperationFormValues): UpdateOperationRequest => ({
  storeCountTotalDomestic: toNumber(values.storeCountTotalDomestic),
  storeCountDirect: toNumber(values.storeCountDirect),
  storeCountOverseas: toNumber(values.storeCountOverseas),
  monthlyRevenueAvg: toNumber(values.monthlyRevenueAvg),
  avgSpendPerPerson: toNumber(values.avgSpendPerPerson),
  avgStoreSizePy: toNumber(values.avgStoreSizePy),
  avgSeatCount: toNumber(values.avgSeatCount),
  targetCustomers: values.targetCustomers,
  usageOccasions: values.usageOccasions,
});

// 단위 표시 (input 우측)
const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type OperationSectionProps = {
  workspaceId: string;
};

export default function OperationSection({ workspaceId }: OperationSectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateBrandOperation, isPending } = useUpdateBrandOperation(workspaceId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<OperationFormValues>({
    resolver: zodResolver(operationSchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandOperation ? toFormValues(settings.brandOperation) : undefined,
  });

  const onSubmit = (values: OperationFormValues) => {
    updateBrandOperation(toRequest(values), {
      onSuccess: () => Toast.success("운영 현황을 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="운영 현황"
      description="브랜드의 매장, 매출 현황을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* row1 — 매장 수 3열 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="storeCountTotalDomestic"
          size="md"
          labelClassName="text-xs"
          label="국내 전체 매장 수"
          placeholder="예: 187"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>개</Unit>}
          error={Boolean(errors.storeCountTotalDomestic)}
          errorText={errors.storeCountTotalDomestic?.message}
          {...register("storeCountTotalDomestic")}
        />
        <Input
          id="storeCountDirect"
          size="md"
          labelClassName="text-xs"
          label="국내 직영점 수"
          placeholder="예: 12"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>개</Unit>}
          error={Boolean(errors.storeCountDirect)}
          errorText={errors.storeCountDirect?.message}
          {...register("storeCountDirect")}
        />
        <Input
          id="storeCountOverseas"
          size="md"
          labelClassName="text-xs"
          label="해외 전체 매장 수"
          placeholder="예: 3"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>개</Unit>}
          error={Boolean(errors.storeCountOverseas)}
          errorText={errors.storeCountOverseas?.message}
          {...register("storeCountOverseas")}
        />
      </div>

      {/* row2 — 매출·규모 4열 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Input
          id="monthlyRevenueAvg"
          size="md"
          labelClassName="text-xs"
          label="월평균 매출"
          placeholder="예: 4200"
          inputMode="numeric"
          className="pr-14"
          endAdornment={<Unit>만원</Unit>}
          error={Boolean(errors.monthlyRevenueAvg)}
          errorText={errors.monthlyRevenueAvg?.message}
          {...register("monthlyRevenueAvg")}
        />
        <Input
          id="avgSpendPerPerson"
          size="md"
          labelClassName="text-xs"
          label="평균 객단가"
          placeholder="예: 13500"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>원</Unit>}
          error={Boolean(errors.avgSpendPerPerson)}
          errorText={errors.avgSpendPerPerson?.message}
          {...register("avgSpendPerPerson")}
        />
        <Input
          id="avgStoreSizePy"
          size="md"
          labelClassName="text-xs"
          label="평균 매장 평형"
          placeholder="예: 28"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>평</Unit>}
          error={Boolean(errors.avgStoreSizePy)}
          errorText={errors.avgStoreSizePy?.message}
          {...register("avgStoreSizePy")}
        />
        <Input
          id="avgSeatCount"
          size="md"
          labelClassName="text-xs"
          label="평균 좌석 수"
          placeholder="예: 42"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>석</Unit>}
          error={Boolean(errors.avgSeatCount)}
          errorText={errors.avgSeatCount?.message}
          {...register("avgSeatCount")}
        />
      </div>

      {/* row3 — 주요 고객층 · 주 이용 상황 (2열) */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormMultiSelect
          control={control}
          name="targetCustomers"
          label="주요 고객층"
          placeholder="고객층을 선택해주세요"
          options={TARGET_CUSTOMER_OPTIONS}
        />
        <FormMultiSelect
          control={control}
          name="usageOccasions"
          label="주 이용 상황"
          placeholder="이용 상황을 선택해주세요"
          options={USAGE_OCCASION_OPTIONS}
        />
      </div>
    </SettingsSection>
  );
}
