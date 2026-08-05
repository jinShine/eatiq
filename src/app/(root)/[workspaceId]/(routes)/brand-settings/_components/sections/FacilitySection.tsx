"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandAreaCriteria } from "@services/api/brand/brand.query";
import { type BrandAreaCriteria } from "@services/api/brand/brand.type";

import FormSelect from "../FormSelect";
import SettingsSection from "../SettingsSection";
import { mergeAreaCriteria } from "./areaCriteriaShared";
import { IMPORTANCE_OPTIONS } from "./policyOptions";

const facilitySchema = z.object({
  gasImportance: z.string(),
  waterImportance: z.string(),
  openFlameImportance: z.string(),
  ventilationImportance: z.string(),
  refrigerationImportance: z.string(),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

const EMPTY_VALUES: FacilityFormValues = {
  gasImportance: "",
  waterImportance: "",
  openFlameImportance: "",
  ventilationImportance: "",
  refrigerationImportance: "",
};

const toFormValues = (criteria: BrandAreaCriteria): FacilityFormValues => ({
  gasImportance: criteria.gasImportance ?? "",
  waterImportance: criteria.waterImportance ?? "",
  openFlameImportance: criteria.openFlameImportance ?? "",
  ventilationImportance: criteria.ventilationImportance ?? "",
  refrigerationImportance: criteria.refrigerationImportance ?? "",
});

type FacilitySectionProps = {
  workspaceId: string;
};

export default function FacilitySection({ workspaceId }: FacilitySectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateAreaCriteria, isPending } = useUpdateBrandAreaCriteria(workspaceId);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandAreaCriteria ? toFormValues(settings.brandAreaCriteria) : undefined,
  });

  const onSubmit = (values: FacilityFormValues) => {
    const body = mergeAreaCriteria(settings?.brandAreaCriteria, values);

    updateAreaCriteria(body, {
      onSuccess: () => Toast.success("매장 시설 필수 조건을 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="매장 시설 필수 조건"
      description="선호하는 계약 조건을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect control={control} name="gasImportance" label="가스 시설" options={IMPORTANCE_OPTIONS} />
        <FormSelect control={control} name="waterImportance" label="급배수" options={IMPORTANCE_OPTIONS} />
        <FormSelect control={control} name="openFlameImportance" label="직화 시설" options={IMPORTANCE_OPTIONS} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect control={control} name="ventilationImportance" label="배기 시설" options={IMPORTANCE_OPTIONS} />
        <FormSelect
          control={control}
          name="refrigerationImportance"
          label="냉장/냉동 저장공간"
          options={IMPORTANCE_OPTIONS}
        />
      </div>
    </SettingsSection>
  );
}
