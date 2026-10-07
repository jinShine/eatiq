"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Input, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandSizeCriteria } from "@services/api/brand/brand.query";
import { type BrandSizeCriteriaData, type UpdateBrandSizeCriteriaRequest } from "@services/api/brand/brand.type";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import { REQUIRED } from "./formFields";
import { toNumberText } from "./numberText";

/**
 * 매장 크기 조건 — PUT /size-criteria. 폼 필드 이름은 저장 DTO와 같다. → BasicInfoSection 주석 참고
 *
 * 서버 규칙(400 응답으로 확인): 4개 모두 필수, 0 이상 숫자. 단위는 스펙·시안 모두 ㎡·m.
 * 서버는 최소 > 최대 평형도 저장해서 화면에서 막는다.
 * 상한 — 서버에 없다. 평형 33,000㎡(약 1만 평, 운영 현황 평균 평형 상한과 같은 규모), 전면 폭 1,000m
 */
const DECIMAL = /^\d+(\.\d)?$/;

const sizeField = (max: number, label: string) =>
  z
    .string()
    .min(1, REQUIRED)
    .regex(DECIMAL, "소수 첫째 자리까지 숫자로 입력해주세요")
    .refine(value => !DECIMAL.test(value) || Number(value) <= max, `${label} 이하로 입력해주세요`);

const AREA = { max: 33_000, label: "33,000㎡" };
const WIDTH = { max: 1_000, label: "1,000m" };

const sizeSchema = z
  .object({
    rec_area: sizeField(AREA.max, AREA.label),
    min_area: sizeField(AREA.max, AREA.label),
    max_area: sizeField(AREA.max, AREA.label),
    min_front_w: sizeField(WIDTH.max, WIDTH.label),
  })
  .refine(
    ({ min_area, max_area }) =>
      !DECIMAL.test(min_area) || !DECIMAL.test(max_area) || Number(min_area) <= Number(max_area),
    { path: ["max_area"], message: "최소 평형보다 작을 수 없어요" },
  );

type SizeFormValues = z.infer<typeof sizeSchema>;

const EMPTY_VALUES: SizeFormValues = { rec_area: "", min_area: "", max_area: "", min_front_w: "" };

const toFormValues = (saved: BrandSizeCriteriaData): SizeFormValues => ({
  rec_area: toNumberText(saved.rec_area),
  min_area: toNumberText(saved.min_area),
  max_area: toNumberText(saved.max_area),
  min_front_w: toNumberText(saved.min_front_w),
});

const toRequest = (values: SizeFormValues): UpdateBrandSizeCriteriaRequest => ({
  rec_area: Number(values.rec_area),
  min_area: Number(values.min_area),
  max_area: Number(values.max_area),
  min_front_w: Number(values.min_front_w),
});

const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type StoreSizeSectionProps = {
  workspaceId: string;
};

export default function StoreSizeSection({ workspaceId }: StoreSizeSectionProps) {
  // React Compiler 제외 — reset 뒤 필드 갱신 문제. → OperationSection 주석 참고
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_size_criteria");
  const { mutate: save, isPending, error, reset: clearSaveError } = useUpdateBrandSizeCriteria(workspaceId);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SizeFormValues>({
    resolver: zodResolver(sizeSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: SizeFormValues) => {
    save(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.brand_size_criteria) : values, { keepFieldsRef: true });
        Toast.success("매장 크기 조건을 저장했어요.");
      },
    });
  };

  // 배치·라벨은 피그마(253:1483~1522) 기준
  return (
    <SettingsSection
      title="매장 크기 조건"
      description="선호하는 매장 크기에 대해 알려주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="rec_area"
          size="md"
          labelClassName="text-xs"
          label="권장 매장 평형"
          required
          placeholder="예: 165"
          inputMode="decimal"
          className="pr-10"
          endAdornment={<Unit>㎡</Unit>}
          error={Boolean(errors.rec_area)}
          errorText={errors.rec_area?.message}
          {...register("rec_area")}
        />
        <Input
          id="min_area"
          size="md"
          labelClassName="text-xs"
          label="선호 매장 평형 - 최소"
          required
          placeholder="예: 99"
          inputMode="decimal"
          className="pr-10"
          endAdornment={<Unit>㎡</Unit>}
          error={Boolean(errors.min_area)}
          errorText={errors.min_area?.message}
          // 최소가 바뀌면 최대 칸의 "최소보다 작을 수 없어요"도 다시 검사한다
          {...register("min_area", { deps: ["max_area"] })}
        />
        <Input
          id="max_area"
          size="md"
          labelClassName="text-xs"
          label="선호 매장 평형 - 최대"
          required
          placeholder="예: 198"
          inputMode="decimal"
          className="pr-10"
          endAdornment={<Unit>㎡</Unit>}
          error={Boolean(errors.max_area)}
          errorText={errors.max_area?.message}
          {...register("max_area")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="min_front_w"
          size="md"
          labelClassName="text-xs"
          label="최소 전면 폭"
          required
          placeholder="예: 6"
          inputMode="decimal"
          className="pr-10"
          endAdornment={<Unit>m</Unit>}
          error={Boolean(errors.min_front_w)}
          errorText={errors.min_front_w?.message}
          {...register("min_front_w")}
        />
      </div>
    </SettingsSection>
  );
}
