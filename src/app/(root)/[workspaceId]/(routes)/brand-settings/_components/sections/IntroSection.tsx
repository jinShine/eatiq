import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Input, Textarea, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandIntro } from "@services/api/brand/brand.query";
import { type BrandIntroData, type UpdateBrandIntroRequest } from "@services/api/brand/brand.type";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import FormSelect from "../FormSelect";
import { CATEGORY_VALUES, PRICE_POSITIONING_VALUES, pickOption, toOptions } from "./IntroOptions";

/**
 * 폼 필드 이름은 저장 DTO(UpdateBrandIntroDto)와 같다. → BasicInfoSection 주석 참고
 *
 * 예외는 핵심 차별점이다. 저장은 배열(key_point) 하나지만 입력칸은 세 개고,
 * 완성도 API가 key_point_01~03으로 가리켜서 입력칸 이름도 그렇게 둔다.
 */
const introSchema = z.object({
  short_intro: z.string().trim().min(1, "한줄 소개를 입력해주세요").max(100, "100자 이내로 입력해주세요"),
  detail_intro: z.string().trim().min(1, "상세 소개를 입력해주세요").max(500, "500자 이내로 입력해주세요"),
  category: z.union([z.enum(CATEGORY_VALUES), z.literal("")], {
    errorMap: () => ({ message: "목록에서 다시 선택해주세요" }),
  }),
  price_positioning: z.union([z.enum(PRICE_POSITIONING_VALUES), z.literal("")], {
    errorMap: () => ({ message: "목록에서 다시 선택해주세요" }),
  }),
  key_point_01: z.string(),
  key_point_02: z.string(),
  key_point_03: z.string(),
});

type IntroFormValues = z.infer<typeof introSchema>;

const EMPTY_VALUES: IntroFormValues = {
  short_intro: "",
  detail_intro: "",
  category: "",
  price_positioning: "",
  key_point_01: "",
  key_point_02: "",
  key_point_03: "",
};

/** 저장값 → 폼. 차별점 배열은 앞에서부터 세 칸에 채운다 */
const toFormValues = (saved: BrandIntroData): IntroFormValues => ({
  short_intro: saved.short_intro ?? "",
  detail_intro: saved.detail_intro ?? "",
  category: pickOption(CATEGORY_VALUES, saved.category),
  price_positioning: pickOption(PRICE_POSITIONING_VALUES, saved.price_positioning),
  key_point_01: saved.key_point?.[0] ?? "",
  key_point_02: saved.key_point?.[1] ?? "",
  key_point_03: saved.key_point?.[2] ?? "",
});

/**
 * 폼 → 요청. 빈 차별점은 뺀다 — 서버가 빈 문자열 항목을 거부한다(빈 배열은 받는다).
 * 선택하지 않은 업종·가격은 보내지 않는다.
 */
const toRequest = (values: IntroFormValues): UpdateBrandIntroRequest => ({
  short_intro: values.short_intro.trim(),
  detail_intro: values.detail_intro.trim(),
  category: values.category || undefined,
  price_positioning: values.price_positioning || undefined,
  key_point: [values.key_point_01, values.key_point_02, values.key_point_03].map(point => point.trim()).filter(Boolean),
});

type IntroSectionProps = {
  workspaceId: string;
};

export default function IntroSection({ workspaceId }: IntroSectionProps) {
  // React Compiler 제외. RHF는 렌더마다 register()가 다시 불려 "화면에 있는 필드" 목록을 채우는 걸 전제한다.
  // 컴파일러가 register() 결과를 메모하면 reset 뒤 그 목록이 빈 채로 남아, 다음 reset이 입력칸을 갱신하지 못한다
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_intro");
  const { mutate: updateBrandIntro, isPending, error, reset: clearSaveError } = useUpdateBrandIntro(workspaceId);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<IntroFormValues>({
    resolver: zodResolver(introSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: IntroFormValues) => {
    updateBrandIntro(toRequest(values), {
      onSuccess: response => {
        // 서버가 저장한 모양으로 폼을 맞춘다(목 모드는 보낸 값). 이걸 해야 dirty가 풀린다.
        // keepFieldsRef: 필드 ref를 유지한 채 입력칸 값을 직접 바꾼다(values prop 경로와 같은 방식)
        reset(response ? toFormValues(response.brand_intro) : values, { keepFieldsRef: true });
        Toast.success("브랜드 소개를 저장했어요.");
      },
    });
  };

  return (
    <SettingsSection
      title="브랜드 소개"
      description="브랜드를 소개할 수 있는 내용들을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* row1 — 한줄 소개 (전체폭) */}
      <Input
        id="short_intro"
        size="md"
        labelClassName="text-xs"
        label="한줄 소개 (100자 이내)"
        required
        placeholder="예: 롤링 파스타"
        error={Boolean(errors.short_intro)}
        errorText={errors.short_intro?.message}
        {...register("short_intro")}
      />

      {/* row2 — 상세 소개 (Textarea → Controller) */}
      <Controller
        name="detail_intro"
        control={control}
        render={({ field }) => (
          <Textarea
            id="detail_intro"
            labelClassName="text-xs"
            label="상세 소개 (500자 이내)"
            required
            placeholder="브랜드의 스토리와 특징을 소개해주세요"
            rows={3}
            error={Boolean(errors.detail_intro)}
            errorText={errors.detail_intro?.message}
            {...field}
          />
        )}
      />

      {/* row3 — 2열 Select */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormSelect
          control={control}
          name="category"
          label="업종 분류"
          placeholder="업종을 선택해주세요"
          options={toOptions(CATEGORY_VALUES)}
        />
        <FormSelect
          control={control}
          name="price_positioning"
          label="가격 포지셔닝"
          placeholder="가격대를 선택해주세요"
          options={toOptions(PRICE_POSITIONING_VALUES)}
        />
      </div>

      {/* row4 — 3열 차별점 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="key_point_01"
          size="md"
          labelClassName="text-xs"
          label="핵심 차별점 01"
          placeholder="예: 건강한 국내산 재료"
          {...register("key_point_01")}
        />
        <Input
          id="key_point_02"
          size="md"
          labelClassName="text-xs"
          label="핵심 차별점 02"
          placeholder="예: 5분 이내 빠른 서비스"
          {...register("key_point_02")}
        />
        <Input
          id="key_point_03"
          size="md"
          labelClassName="text-xs"
          label="핵심 차별점 03"
          placeholder="예: 합리적인 가격"
          {...register("key_point_03")}
        />
      </div>
    </SettingsSection>
  );
}
