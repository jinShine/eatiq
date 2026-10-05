"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandFacilityReq } from "@services/api/brand/brand.query";
import { type BrandFacilityReqData, type UpdateBrandFacilityReqRequest } from "@services/api/brand/brand.type";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import FormSelect from "../FormSelect";
import { pickOption, toOptions } from "./IntroOptions";
import { chosen, requiredChoice } from "./formFields";
import { REQUIREMENT_VALUES } from "./policyOptions";

/**
 * 매장 시설 필수 조건 — PUT /facility-req. 폼 필드 이름은 저장 DTO와 같다. → BasicInfoSection 주석 참고
 * 서버 규칙: 5개 모두 필수(필수·선호·불필요).
 */
const facilitySchema = z.object({
  gas_req: requiredChoice(REQUIREMENT_VALUES),
  plumbing_req: requiredChoice(REQUIREMENT_VALUES),
  direct_fire_req: requiredChoice(REQUIREMENT_VALUES),
  vent_req: requiredChoice(REQUIREMENT_VALUES),
  cold_storage_req: requiredChoice(REQUIREMENT_VALUES),
});

type FacilityFormValues = z.infer<typeof facilitySchema>;

const EMPTY_VALUES: FacilityFormValues = {
  gas_req: "",
  plumbing_req: "",
  direct_fire_req: "",
  vent_req: "",
  cold_storage_req: "",
};

const toFormValues = (saved: BrandFacilityReqData): FacilityFormValues => ({
  gas_req: pickOption(REQUIREMENT_VALUES, saved.gas_req),
  plumbing_req: pickOption(REQUIREMENT_VALUES, saved.plumbing_req),
  direct_fire_req: pickOption(REQUIREMENT_VALUES, saved.direct_fire_req),
  vent_req: pickOption(REQUIREMENT_VALUES, saved.vent_req),
  cold_storage_req: pickOption(REQUIREMENT_VALUES, saved.cold_storage_req),
});

const toRequest = (values: FacilityFormValues): UpdateBrandFacilityReqRequest => ({
  gas_req: chosen(values.gas_req),
  plumbing_req: chosen(values.plumbing_req),
  direct_fire_req: chosen(values.direct_fire_req),
  vent_req: chosen(values.vent_req),
  cold_storage_req: chosen(values.cold_storage_req),
});

type FacilitySectionProps = {
  workspaceId: string;
};

export default function FacilitySection({ workspaceId }: FacilitySectionProps) {
  // React Compiler 제외 — reset 뒤 필드 갱신 문제. → OperationSection 주석 참고
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_facility_req");
  const { mutate: save, isPending, error, reset: clearSaveError } = useUpdateBrandFacilityReq(workspaceId);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: FacilityFormValues) => {
    save(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.brand_facility_req) : values, { keepFieldsRef: true });
        Toast.success("매장 시설 필수 조건을 저장했어요.");
      },
    });
  };

  const options = toOptions(REQUIREMENT_VALUES);

  // 배치·라벨은 피그마(253:878) 기준. 설명 문구는 시안 그대로(계약 탭 문구와 같아 디자인 확인 요청)
  return (
    <SettingsSection
      title="매장 시설 필수 조건"
      description="선호하는 계약 조건을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect control={control} name="gas_req" label="가스 시설" required options={options} />
        <FormSelect control={control} name="plumbing_req" label="급배수" required options={options} />
        <FormSelect control={control} name="direct_fire_req" label="직화 시설" required options={options} />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect control={control} name="vent_req" label="배기 시설" required options={options} />
        <FormSelect control={control} name="cold_storage_req" label="냉장/냉동 저장공간" required options={options} />
      </div>
    </SettingsSection>
  );
}
