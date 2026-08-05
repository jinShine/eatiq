"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandAreaCriteria } from "@services/api/brand/brand.query";
import { type BrandAreaCriteria } from "@services/api/brand/brand.type";

import FormSelect from "../FormSelect";
import SettingsSection from "../SettingsSection";
import { mergeAreaCriteria, toNumber, toText } from "./areaCriteriaShared";
import { AREA_TYPE_OPTIONS, FLOOR_OPTIONS, IMPORTANCE_OPTIONS } from "./policyOptions";

const numberField = z.string().refine(v => !v || /^\d+$/.test(v), { message: "숫자만 입력해주세요" });

// PATCH /api/brands/{brandId}/area-criteria — 전체 치환
// StoreSizeSection·FacilitySection과 같은 엔드포인트를 공유하므로 mergeAreaCriteria로 병합 전송한다
const locationSchema = z.object({
  preferredArea1st: z.string(), // 1차 선호 상권 · area_type
  preferredArea2nd: z.string(), // 2차 선호 상권 · area_type
  preferredArea3rd: z.string(), // 3차 선호 상권 · area_type
  rentMinKrw: numberField, // 허용 월 임대료 최소 (원)
  rentMaxKrw: numberField, // 허용 월 임대료 최대 (원)
  allowableFloor: z.string(), // 허용 층수 범위 · floor_type
  signageImportance: z.string(), // 간판 노출 중요도 · importance_level
  storeSizeImportance: z.string(), // 매장 노출 중요도 · importance_level
  parkingImportance: z.string(), // 주차 필요 여부 · importance_level
  waitingSpaceImportance: z.string(), // 대기공간 필요 여부 · importance_level
  lunchSalesImportance: z.string(), // 점심 매출 중요도 · importance_level
  latenightSalesImportance: z.string(), // 심야 매출 중요도 · importance_level
  weekdaySalesImportance: z.string(), // 주중 매출 중요도 · importance_level
  weekendSalesImportance: z.string(), // 주말 매출 중요도 · importance_level
});

type LocationFormValues = z.infer<typeof locationSchema>;

const EMPTY_VALUES: LocationFormValues = {
  preferredArea1st: "",
  preferredArea2nd: "",
  preferredArea3rd: "",
  rentMinKrw: "",
  rentMaxKrw: "",
  allowableFloor: "",
  signageImportance: "",
  storeSizeImportance: "",
  parkingImportance: "",
  waitingSpaceImportance: "",
  lunchSalesImportance: "",
  latenightSalesImportance: "",
  weekdaySalesImportance: "",
  weekendSalesImportance: "",
};

const toFormValues = (criteria: BrandAreaCriteria): LocationFormValues => ({
  preferredArea1st: criteria.preferredArea1st ?? "",
  preferredArea2nd: criteria.preferredArea2nd ?? "",
  preferredArea3rd: criteria.preferredArea3rd ?? "",
  rentMinKrw: toText(criteria.rentMinKrw),
  rentMaxKrw: toText(criteria.rentMaxKrw),
  allowableFloor: criteria.allowableFloor ?? "",
  signageImportance: criteria.signageImportance ?? "",
  storeSizeImportance: criteria.storeSizeImportance ?? "",
  parkingImportance: criteria.parkingImportance ?? "",
  waitingSpaceImportance: criteria.waitingSpaceImportance ?? "",
  lunchSalesImportance: criteria.lunchSalesImportance ?? "",
  latenightSalesImportance: criteria.latenightSalesImportance ?? "",
  weekdaySalesImportance: criteria.weekdaySalesImportance ?? "",
  weekendSalesImportance: criteria.weekendSalesImportance ?? "",
});

const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type LocationCriteriaSectionProps = {
  workspaceId: string;
};

export default function LocationCriteriaSection({ workspaceId }: LocationCriteriaSectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateAreaCriteria, isPending } = useUpdateBrandAreaCriteria(workspaceId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandAreaCriteria ? toFormValues(settings.brandAreaCriteria) : undefined,
  });

  const onSubmit = (values: LocationFormValues) => {
    const body = mergeAreaCriteria(settings?.brandAreaCriteria, {
      ...values,
      rentMinKrw: toNumber(values.rentMinKrw),
      rentMaxKrw: toNumber(values.rentMaxKrw),
    });

    updateAreaCriteria(body, {
      onSuccess: () => Toast.success("입지 및 상권 기준을 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="입지 및 상권 기준"
      description="선호하는 입지 및 상권 기준을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect control={control} name="preferredArea1st" label="1차 선호 상권" options={AREA_TYPE_OPTIONS} />
        <FormSelect control={control} name="preferredArea2nd" label="2차 선호 상권" options={AREA_TYPE_OPTIONS} />
        <FormSelect control={control} name="preferredArea3rd" label="3차 선호 상권" options={AREA_TYPE_OPTIONS} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="rentMinKrw"
          size="md"
          labelClassName="text-xs"
          label="허용 월 임대료 - 최소"
          placeholder="예: 9000000"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>원</Unit>}
          error={Boolean(errors.rentMinKrw)}
          errorText={errors.rentMinKrw?.message}
          {...register("rentMinKrw")}
        />
        <Input
          id="rentMaxKrw"
          size="md"
          labelClassName="text-xs"
          label="허용 월 임대료 - 최대"
          placeholder="예: 12000000"
          inputMode="numeric"
          className="pr-10"
          endAdornment={<Unit>원</Unit>}
          error={Boolean(errors.rentMaxKrw)}
          errorText={errors.rentMaxKrw?.message}
          {...register("rentMaxKrw")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect control={control} name="allowableFloor" label="허용 층수 범위" options={FLOOR_OPTIONS} />
        <FormSelect control={control} name="signageImportance" label="간판 노출 중요도" options={IMPORTANCE_OPTIONS} />
        <FormSelect
          control={control}
          name="storeSizeImportance"
          label="매장 노출 중요도"
          options={IMPORTANCE_OPTIONS}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect control={control} name="parkingImportance" label="주차 필요 여부" options={IMPORTANCE_OPTIONS} />
        <FormSelect
          control={control}
          name="waitingSpaceImportance"
          label="대기공간 필요 여부"
          options={IMPORTANCE_OPTIONS}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <FormSelect
          control={control}
          name="lunchSalesImportance"
          label="점심 매출 중요도"
          options={IMPORTANCE_OPTIONS}
        />
        <FormSelect
          control={control}
          name="latenightSalesImportance"
          label="심야 매출 중요도"
          options={IMPORTANCE_OPTIONS}
        />
        <FormSelect
          control={control}
          name="weekdaySalesImportance"
          label="주중 매출 중요도"
          options={IMPORTANCE_OPTIONS}
        />
        <FormSelect
          control={control}
          name="weekendSalesImportance"
          label="주말 매출 중요도"
          options={IMPORTANCE_OPTIONS}
        />
      </div>
    </SettingsSection>
  );
}
