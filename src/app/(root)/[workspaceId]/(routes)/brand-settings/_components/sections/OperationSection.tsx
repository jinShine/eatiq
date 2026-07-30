import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandOperation } from "@services/api/brand/brand.query";
import { type BrandOperation, type UpdateOperationRequest } from "@services/api/brand/brand.type";

import SettingsSection from "../SettingsSection";

// 숫자 입력은 문자열로 다루고 제출 시 변환 — 빈칸/0 구분을 위해
const numberField = z.string().refine(v => !v || /^\d+$/.test(v), { message: "숫자만 입력해주세요" });

const operationSchema = z.object({
  storeCountTotalDomestic: numberField,
  storeCountDirect: numberField,
  storeCountOverseas: numberField,
  monthlyRevenueAvg: numberField,
  avgSpendPerPerson: numberField,
  avgStoreSizePy: numberField,
  avgSeatCount: numberField,
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

      {/* TODO: 주요 고객층·주 이용 상황 (배열) — 서버 코드값 확정 후 MultiSelect 추가 */}
    </SettingsSection>
  );
}
