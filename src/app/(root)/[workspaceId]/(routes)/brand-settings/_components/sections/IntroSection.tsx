import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Select, SelectItem, Textarea, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandIntro } from "@services/api/brand/brand.query";
import { type BrandIntro, type UpdateIntroRequest } from "@services/api/brand/brand.type";

import SettingsSection from "../SettingsSection";
import { CATEGORY_OPTIONS, PRICE_POSITIONING_OPTIONS } from "./IntroOptions";

const introSchema = z.object({
  oneLiner: z.string().max(100, "100자 이내로 입력해주세요"),
  description: z.string().max(500, "500자 이내로 입력해주세요"),
  category: z.string(),
  pricePositioning: z.string(),
  differentiator1: z.string(),
  differentiator2: z.string(),
  differentiator3: z.string(),
});

type IntroFormValues = z.infer<typeof introSchema>;

const EMPTY_VALUES: IntroFormValues = {
  oneLiner: "",
  description: "",
  category: "",
  pricePositioning: "",
  differentiator1: "",
  differentiator2: "",
  differentiator3: "",
};

const toFormValues = (intro: BrandIntro): IntroFormValues => ({
  oneLiner: intro.oneLiner ?? "",
  description: intro.description ?? "",
  category: intro.category ?? "",
  pricePositioning: intro.pricePositioning ?? "",
  differentiator1: intro.differentiator1 ?? "",
  differentiator2: intro.differentiator2 ?? "",
  differentiator3: intro.differentiator3 ?? "",
});

const toRequest = (values: IntroFormValues): UpdateIntroRequest => ({ ...values });

type IntroSectionProps = {
  workspaceId: string;
};

export default function IntroSection({ workspaceId }: IntroSectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateBrandIntro, isPending } = useUpdateBrandIntro(workspaceId);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<IntroFormValues>({
    resolver: zodResolver(introSchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandIntro ? toFormValues(settings.brandIntro) : undefined,
  });

  const onSubmit = (values: IntroFormValues) => {
    updateBrandIntro(toRequest(values), {
      onSuccess: () => Toast.success("브랜드 소개를 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="브랜드 소개"
      description="브랜드를 소개할 수 있는 내용들을 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* row1 — 한줄 소개 (전체폭) */}
      <Input
        id="oneLiner"
        size="md"
        labelClassName="text-xs"
        label="한줄 소개 (100자 이내)"
        placeholder="예: 롤링 파스타"
        error={Boolean(errors.oneLiner)}
        errorText={errors.oneLiner?.message}
        {...register("oneLiner")}
      />

      {/* row2 — 상세 소개 (Textarea → Controller) */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea
            id="description"
            labelClassName="text-xs"
            label="상세 소개 (500자 이내)"
            placeholder="브랜드의 스토리와 특징을 소개해주세요"
            rows={3}
            error={Boolean(errors.description)}
            errorText={errors.description?.message}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />

      {/* row3 — 2열 Select */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              size="md"
              labelClassName="text-xs"
              label="업종 분류"
              placeholder="업종을 선택해주세요"
              value={field.value}
              onValueChange={field.onChange}
            >
              {CATEGORY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <Controller
          name="pricePositioning"
          control={control}
          render={({ field }) => (
            <Select
              size="md"
              labelClassName="text-xs"
              label="가격 포지셔닝"
              placeholder="가격대를 선택해주세요"
              value={field.value}
              onValueChange={field.onChange}
            >
              {PRICE_POSITIONING_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
      </div>

      {/* row4 — 3열 차별점 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="differentiator1"
          size="md"
          labelClassName="text-xs"
          label="핵심 차별점 01"
          placeholder="예: 건강한 국내산 재료"
          {...register("differentiator1")}
        />
        <Input
          id="differentiator2"
          size="md"
          labelClassName="text-xs"
          label="핵심 차별점 02"
          placeholder="예: 5분 이내 빠른 서비스"
          {...register("differentiator2")}
        />
        <Input
          id="differentiator3"
          size="md"
          labelClassName="text-xs"
          label="핵심 차별점 03"
          placeholder="예: 합리적인 가격"
          {...register("differentiator3")}
        />
      </div>
    </SettingsSection>
  );
}
