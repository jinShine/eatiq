"use client";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { CommaNumberInput, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandLocationStandard } from "@services/api/brand/brand.query";
import {
  type BrandLocationStandardData,
  type UpdateBrandLocationStandardRequest,
} from "@services/api/brand/brand.type";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import FormSelect from "../FormSelect";
import { pickOption, toOptions } from "./IntroOptions";
import { INTEGER, SELECT_REQUIRED, chosen, requiredChoice, wonField } from "./formFields";
import { toNumberText } from "./numberText";
import {
  DISTRICT_VALUES,
  FLOOR_RANGE_VALUES,
  IMPORTANCE_VALUES,
  REQUIREMENT_VALUES,
  SALES_IMPORTANCE_VALUES,
} from "./policyOptions";

/**
 * 입지 및 상권 기준 — PUT /location-standard. 폼 필드 이름은 저장 DTO와 같다. → BasicInfoSection 주석 참고
 *
 * 서버 규칙(400 응답으로 확인): 1·2차 선호 상권 필수(문자열이면 무엇이든), 3차는 선택,
 * 임대료 최소·최대 필수(0 이상), 층수·중요도·필요 여부 9개는 선택지 필수.
 * 서버는 최소 > 최대 임대료도 저장해서 화면에서 막는다.
 */
const NO_DISTRICT = "미입력"; // 3차 선호 상권 "선택 안 함" — Radix Select는 빈 값을 항목으로 둘 수 없다

const locationSchema = z
  .object({
    district_01: z.string().min(1, SELECT_REQUIRED),
    district_02: z.string().min(1, SELECT_REQUIRED),
    district_03: z.string(),
    min_rent: wonField(),
    max_rent: wonField(),
    floor_range: requiredChoice(FLOOR_RANGE_VALUES),
    sign_imp: requiredChoice(IMPORTANCE_VALUES),
    store_imp: requiredChoice(IMPORTANCE_VALUES),
    parking_req: requiredChoice(REQUIREMENT_VALUES),
    waiting_req: requiredChoice(REQUIREMENT_VALUES),
    lunch_imp: requiredChoice(SALES_IMPORTANCE_VALUES),
    night_imp: requiredChoice(SALES_IMPORTANCE_VALUES),
    weekday_imp: requiredChoice(IMPORTANCE_VALUES),
    weekend_imp: requiredChoice(IMPORTANCE_VALUES),
  })
  // 두 값이 모두 숫자일 때만 비교한다(zod 3은 다른 칸이 실패해도 refine을 돌린다)
  .refine(
    ({ min_rent, max_rent }) =>
      !INTEGER.test(min_rent) || !INTEGER.test(max_rent) || Number(min_rent) <= Number(max_rent),
    { path: ["max_rent"], message: "최소 임대료보다 작을 수 없어요" },
  );

type LocationFormValues = z.infer<typeof locationSchema>;

const EMPTY_VALUES: LocationFormValues = {
  district_01: "",
  district_02: "",
  district_03: "",
  min_rent: "",
  max_rent: "",
  floor_range: "",
  sign_imp: "",
  store_imp: "",
  parking_req: "",
  waiting_req: "",
  lunch_imp: "",
  night_imp: "",
  weekday_imp: "",
  weekend_imp: "",
};

const toFormValues = (saved: BrandLocationStandardData): LocationFormValues => ({
  // 선호 상권은 서버가 아무 문자열이나 받아, 목록 밖 값도 그대로 둔다(선택지에 덧붙여 보여준다)
  district_01: saved.district_01 ?? "",
  district_02: saved.district_02 ?? "",
  district_03: saved.district_03 && saved.district_03 !== NO_DISTRICT ? saved.district_03 : "",
  min_rent: toNumberText(saved.min_rent),
  max_rent: toNumberText(saved.max_rent),
  floor_range: pickOption(FLOOR_RANGE_VALUES, saved.floor_range),
  sign_imp: pickOption(IMPORTANCE_VALUES, saved.sign_imp),
  store_imp: pickOption(IMPORTANCE_VALUES, saved.store_imp),
  parking_req: pickOption(REQUIREMENT_VALUES, saved.parking_req),
  waiting_req: pickOption(REQUIREMENT_VALUES, saved.waiting_req),
  lunch_imp: pickOption(SALES_IMPORTANCE_VALUES, saved.lunch_imp),
  night_imp: pickOption(SALES_IMPORTANCE_VALUES, saved.night_imp),
  weekday_imp: pickOption(IMPORTANCE_VALUES, saved.weekday_imp),
  weekend_imp: pickOption(IMPORTANCE_VALUES, saved.weekend_imp),
});

const toRequest = (values: LocationFormValues): UpdateBrandLocationStandardRequest => ({
  district_01: values.district_01,
  district_02: values.district_02,
  district_03: values.district_03 && values.district_03 !== NO_DISTRICT ? values.district_03 : undefined,
  min_rent: Number(values.min_rent),
  max_rent: Number(values.max_rent),
  floor_range: chosen(values.floor_range),
  sign_imp: chosen(values.sign_imp),
  store_imp: chosen(values.store_imp),
  parking_req: chosen(values.parking_req),
  waiting_req: chosen(values.waiting_req),
  lunch_imp: chosen(values.lunch_imp),
  night_imp: chosen(values.night_imp),
  weekday_imp: chosen(values.weekday_imp),
  weekend_imp: chosen(values.weekend_imp),
});

/** 선호 상권 선택지 — 저장된 값이 목록 밖이면 덧붙여서 화면에 그대로 보이게 한다 */
const districtOptions = (current: string, { allowNone = false } = {}) => {
  const values = [
    ...DISTRICT_VALUES,
    ...(current && !(DISTRICT_VALUES as readonly string[]).includes(current) ? [current] : []),
  ];
  return [...(allowNone ? [NO_DISTRICT] : []), ...values].map(value => ({ value, label: value }));
};

const Unit = ({ children }: { children: string }) => <span className="text-text-tertiary text-sm">{children}</span>;

type LocationCriteriaSectionProps = {
  workspaceId: string;
};

export default function LocationCriteriaSection({ workspaceId }: LocationCriteriaSectionProps) {
  // React Compiler 제외 — reset 뒤 필드 갱신 문제. → OperationSection 주석 참고
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_location_standard");
  const { mutate: save, isPending, error, reset: clearSaveError } = useUpdateBrandLocationStandard(workspaceId);

  const {
    control,
    reset,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: LocationFormValues) => {
    save(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.brand_location_standard) : values, { keepFieldsRef: true });
        Toast.success("입지 및 상권 기준을 저장했어요.");
      },
    });
  };

  // 배치·라벨은 피그마(253:801) 기준
  return (
    <SettingsSection
      title="입지 및 상권 기준"
      description="선호하는 입지 및 상권 기준을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* row1 — 선호 상권 3개 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect
          control={control}
          name="district_01"
          label="1차 선호 상권"
          required
          options={districtOptions(getValues("district_01"))}
        />
        <FormSelect
          control={control}
          name="district_02"
          label="2차 선호 상권"
          required
          options={districtOptions(getValues("district_02"))}
        />
        <FormSelect
          control={control}
          name="district_03"
          label="3차 선호 상권"
          placeholder={NO_DISTRICT}
          options={districtOptions(getValues("district_03"), { allowNone: true })}
        />
      </div>

      {/* row2 — 임대료 (원, 쉼표 입력) */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Controller
          name="min_rent"
          control={control}
          // 최소가 바뀌면 최대 칸의 "최소보다 작을 수 없어요"도 다시 검사한다
          rules={{ deps: ["max_rent"] }}
          render={({ field }) => (
            <CommaNumberInput
              id="min_rent"
              size="md"
              labelClassName="text-xs"
              label="허용 월 임대료 - 최소"
              required
              placeholder="예: 9,000,000"
              className="pr-10"
              endAdornment={<Unit>원</Unit>}
              error={Boolean(errors.min_rent)}
              errorText={errors.min_rent?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="max_rent"
          control={control}
          render={({ field }) => (
            <CommaNumberInput
              id="max_rent"
              size="md"
              labelClassName="text-xs"
              label="허용 월 임대료 - 최대"
              required
              placeholder="예: 12,000,000"
              className="pr-10"
              endAdornment={<Unit>원</Unit>}
              error={Boolean(errors.max_rent)}
              errorText={errors.max_rent?.message}
              {...field}
            />
          )}
        />
      </div>

      {/* row3 — 층수·노출 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect
          control={control}
          name="floor_range"
          label="허용 층수 범위"
          required
          options={toOptions(FLOOR_RANGE_VALUES)}
        />
        <FormSelect
          control={control}
          name="sign_imp"
          label="간판 노출 중요도"
          required
          options={toOptions(IMPORTANCE_VALUES)}
        />
        <FormSelect
          control={control}
          name="store_imp"
          label="매장 노출 중요도"
          required
          options={toOptions(IMPORTANCE_VALUES)}
        />
      </div>

      {/* row4 — 주차·대기공간 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormSelect
          control={control}
          name="parking_req"
          label="주차 필요 여부"
          required
          options={toOptions(REQUIREMENT_VALUES)}
        />
        <FormSelect
          control={control}
          name="waiting_req"
          label="대기공간 필요 여부"
          required
          options={toOptions(REQUIREMENT_VALUES)}
        />
      </div>

      {/* row5 — 매출 중요도 4열 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <FormSelect
          control={control}
          name="lunch_imp"
          label="점심 매출 중요도"
          required
          options={toOptions(SALES_IMPORTANCE_VALUES)}
        />
        <FormSelect
          control={control}
          name="night_imp"
          label="심야 매출 중요도"
          required
          options={toOptions(SALES_IMPORTANCE_VALUES)}
        />
        <FormSelect
          control={control}
          name="weekday_imp"
          label="주중 매출 중요도"
          required
          options={toOptions(IMPORTANCE_VALUES)}
        />
        <FormSelect
          control={control}
          name="weekend_imp"
          label="주말 매출 중요도"
          required
          options={toOptions(IMPORTANCE_VALUES)}
        />
      </div>
    </SettingsSection>
  );
}
