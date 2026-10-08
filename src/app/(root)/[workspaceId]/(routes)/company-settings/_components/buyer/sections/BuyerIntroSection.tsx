"use client";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Input, Textarea, Toast } from "@components/ui";

import { useBuyerSection, useUpdateBuyerIntro } from "@services/api/buyer/buyer.query";
import { type BuyerIntroData, type UpdateBuyerIntroRequest } from "@services/api/buyer/buyer.type";

import useClearOnFormChange from "../../../_hooks/useClearOnFormChange";

/**
 * 회사 소개 (피그마 961:10022) — PUT /buyer/intro. 폼 필드 이름은 저장 DTO와 같다.
 * 서버 규칙(400 응답으로 확인): 회사 소개 필수 500자, 핵심 차별점 01~03 선택 각 100자.
 * 브랜드 소개는 차별점을 배열로 받지만 바이어는 칸 3개로 따로 받는다.
 */
const maxLength = (max: number) => `${max}자 이내로 입력해주세요`;
const keyPoint = z.string().trim().max(100, maxLength(100));

const introSchema = z.object({
  detail_intro: z.string().trim().min(1, "회사 소개를 입력해주세요").max(500, maxLength(500)),
  key_point_01: keyPoint,
  key_point_02: keyPoint,
  key_point_03: keyPoint,
});

type IntroFormValues = z.infer<typeof introSchema>;

const EMPTY_VALUES: IntroFormValues = { detail_intro: "", key_point_01: "", key_point_02: "", key_point_03: "" };

const toFormValues = (saved: BuyerIntroData): IntroFormValues => ({
  detail_intro: saved.detail_intro ?? "",
  key_point_01: saved.key_point_01 ?? "",
  key_point_02: saved.key_point_02 ?? "",
  key_point_03: saved.key_point_03 ?? "",
});

const toRequest = (values: IntroFormValues): UpdateBuyerIntroRequest => ({
  detail_intro: values.detail_intro.trim(),
  key_point_01: values.key_point_01.trim() || undefined,
  key_point_02: values.key_point_02.trim() || undefined,
  key_point_03: values.key_point_03.trim() || undefined,
});

const KEY_POINTS = [
  { name: "key_point_01", label: "핵심 차별점 01", placeholder: "예: 풍부한 경험" },
  { name: "key_point_02", label: "핵심 차별점 02", placeholder: "예: 식자재 체인 보유" },
  { name: "key_point_03", label: "핵심 차별점 03", placeholder: "핵심 차별점을 입력해주세요" },
] as const;

type BuyerIntroSectionProps = {
  workspaceId: string;
};

export default function BuyerIntroSection({ workspaceId }: BuyerIntroSectionProps) {
  // React Compiler 제외 → BasicInfoSection 주석 참고
  "use no memo";

  const { data: saved } = useBuyerSection(workspaceId, "buyer_intro");
  const { mutate: updateBuyerIntro, isPending, error, reset: clearSaveError } = useUpdateBuyerIntro(workspaceId);

  const {
    control,
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IntroFormValues>({
    resolver: zodResolver(introSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: IntroFormValues) => {
    updateBuyerIntro(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.buyer_intro) : values, { keepFieldsRef: true });
        Toast.success("회사 소개를 저장했어요.");
      },
    });
  };

  return (
    <SettingsSection
      title="회사 소개"
      description="회사의 소개와 강점을 알려주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="detail_intro"
        control={control}
        render={({ field }) => (
          <Textarea
            id="detail_intro"
            labelClassName="text-xs"
            label="회사 소개 (500자 이내)"
            required
            placeholder="회사의 소개와 강점을 입력해주세요"
            rows={3}
            error={Boolean(errors.detail_intro)}
            errorText={errors.detail_intro?.message}
            {...field}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {KEY_POINTS.map(point => (
          <Input
            key={point.name}
            id={point.name}
            size="md"
            labelClassName="text-xs"
            label={point.label}
            placeholder={point.placeholder}
            error={Boolean(errors[point.name])}
            errorText={errors[point.name]?.message}
            {...register(point.name)}
          />
        ))}
      </div>
    </SettingsSection>
  );
}
