"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandAreaCriteria } from "@services/api/brand/brand.query";
import { type BrandAreaCriteria } from "@services/api/brand/brand.type";

import SettingsSection from "../SettingsSection";
import { mergeAreaCriteria, toNumber, toText } from "./areaCriteriaShared";

const numberField = z.string().refine(v => !v || /^\d+$/.test(v), { message: "숫자만 입력해주세요" });

// PATCH /api/brands/{brandId}/area-criteria — 전체 치환 (LocationCriteria·Facility와 엔드포인트 공유)
// TODO(백엔드): 필드명은 ...Py(평)인데 디자인은 ㎡로 표기 — 저장 단위 확인 필요
const storeSizeSchema = z.object({
  recommendedSizePy: numberField, // 권장 매장 평형
  sizeMinPy: numberField, // 선호 매장 평형 최소
  sizeMaxPy: numberField, // 선호 매장 평형 최대
  minFrontageM: numberField, // 최소 전면폭 (m)
});

type StoreSizeFormValues = z.infer<typeof storeSizeSchema>;

const EMPTY_VALUES: StoreSizeFormValues = {
  recommendedSizePy: "",
  sizeMinPy: "",
  sizeMaxPy: "",
  minFrontageM: "",
};

const toFormValues = (criteria: BrandAreaCriteria): StoreSizeFormValues => ({
  recommendedSizePy: toText(criteria.recommendedSizePy),
  sizeMinPy: toText(criteria.sizeMinPy),
  sizeMaxPy: toText(criteria.sizeMaxPy),
  minFrontageM: toText(criteria.minFrontageM),
});

const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type StoreSizeSectionProps = {
  workspaceId: string;
};

export default function StoreSizeSection({ workspaceId }: StoreSizeSectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateAreaCriteria, isPending } = useUpdateBrandAreaCriteria(workspaceId);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<StoreSizeFormValues>({
    resolver: zodResolver(storeSizeSchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandAreaCriteria ? toFormValues(settings.brandAreaCriteria) : undefined,
  });

  const onSubmit = (values: StoreSizeFormValues) => {
    const body = mergeAreaCriteria(settings?.brandAreaCriteria, {
      recommendedSizePy: toNumber(values.recommendedSizePy),
      sizeMinPy: toNumber(values.sizeMinPy),
      sizeMaxPy: toNumber(values.sizeMaxPy),
      minFrontageM: toNumber(values.minFrontageM),
    });

    updateAreaCriteria(body, {
      onSuccess: () => Toast.success("매장 크기 조건을 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="매장 크기 조건"
      description="선호하는 매장 크기에 대해 알려주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="recommendedSizePy"
          size="md"
          labelClassName="text-xs"
          label="권장 매장 평형"
          placeholder="예: 165"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>㎡</Unit>}
          error={Boolean(errors.recommendedSizePy)}
          errorText={errors.recommendedSizePy?.message}
          {...register("recommendedSizePy")}
        />
        <Input
          id="sizeMinPy"
          size="md"
          labelClassName="text-xs"
          label="선호 매장 평형 - 최소"
          placeholder="예: 99"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>㎡</Unit>}
          error={Boolean(errors.sizeMinPy)}
          errorText={errors.sizeMinPy?.message}
          {...register("sizeMinPy")}
        />
        <Input
          id="sizeMaxPy"
          size="md"
          labelClassName="text-xs"
          label="선호 매장 평형 - 최대"
          placeholder="예: 198"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>㎡</Unit>}
          error={Boolean(errors.sizeMaxPy)}
          errorText={errors.sizeMaxPy?.message}
          {...register("sizeMaxPy")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="minFrontageM"
          size="md"
          labelClassName="text-xs"
          label="최소 전면폭"
          placeholder="예: 6"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>m</Unit>}
          error={Boolean(errors.minFrontageM)}
          errorText={errors.minFrontageM?.message}
          {...register("minFrontageM")}
        />
      </div>
    </SettingsSection>
  );
}
