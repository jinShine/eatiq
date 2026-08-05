import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandBasic } from "@services/api/brand/brand.query";
import { type BrandBasic, type UpdateBasicRequest } from "@services/api/brand/brand.type";

import SettingsSection from "../SettingsSection";

// PATCH /api/brands/{brandId}/basic — 전체 치환
const basicInfoSchema = z.object({
  nameKo: z.string().min(1, "브랜드 이름(한국어)을 입력해주세요"), // 브랜드 이름(국문) · 필수
  nameEn: z.string().min(1, "브랜드 이름(영어)을 입력해주세요"), // 브랜드 이름(영문) · 필수
  launchYear: z.string().refine(v => !v || /^\d{4}$/.test(v), { message: "연도 4자리를 입력해주세요" }), // 설립 연도 · 4자리
  ceoNameKo: z.string(), // 대표자 이름(국문)
  ceoNameEn: z.string(), // 대표자 이름(영문)
  hqWebsite: z.string(), // 본사 홈페이지
  hqEmail: z.union([z.string().email("올바른 이메일 형식이 아니에요"), z.literal("")]), // 본사 대표 이메일 · 빈 값 허용
  hqAddress: z.string(), // 본사 주소
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

const EMPTY_VALUES: BasicInfoFormValues = {
  nameKo: "",
  nameEn: "",
  launchYear: "",
  ceoNameKo: "",
  ceoNameEn: "",
  hqWebsite: "",
  hqEmail: "",
  hqAddress: "",
};

// 서버 DTO → 폼 값
const toFormValues = (brand: BrandBasic): BasicInfoFormValues => ({
  nameKo: brand.nameKo ?? "",
  nameEn: brand.nameEn ?? "",
  launchYear: brand.launchYear ? String(brand.launchYear) : "",
  ceoNameKo: brand.ceoNameKo ?? "",
  ceoNameEn: brand.ceoNameEn ?? "",
  hqWebsite: brand.hqWebsite ?? "",
  hqEmail: brand.hqEmail ?? "",
  hqAddress: brand.hqAddress ?? "",
});

const toRequest = (values: BasicInfoFormValues): UpdateBasicRequest => ({
  ...values,
  launchYear: values.launchYear ? Number(values.launchYear) : undefined,
});

type BasicInfoSectionProps = {
  workspaceId: string;
};

export default function BasicInfoSection({ workspaceId }: BasicInfoSectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateBrandBasic, isPending } = useUpdateBrandBasic(workspaceId);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brand ? toFormValues(settings.brand) : undefined,
  });

  const onSubmit = (values: BasicInfoFormValues) => {
    updateBrandBasic(toRequest(values), {
      onSuccess: () => Toast.success("브랜드 기본 정보를 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="브랜드 기본 정보"
      description="이름, 런칭 연도, 본사 연락처를 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* row1 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="nameKo"
          size="md"
          labelClassName="text-xs"
          label="브랜드 이름 (한국어)"
          placeholder="예: 롤링 파스타"
          error={Boolean(errors.nameKo)}
          errorText={errors.nameKo?.message}
          {...register("nameKo")}
        />
        <Input
          id="nameEn"
          size="md"
          labelClassName="text-xs"
          label="브랜드 이름 (영어)"
          placeholder="예: Rolling Pasta"
          error={Boolean(errors.nameEn)}
          errorText={errors.nameEn?.message}
          {...register("nameEn")}
        />
        <Input
          id="launchYear"
          size="md"
          labelClassName="text-xs"
          label="설립 연도"
          placeholder="예: 2018"
          inputMode="numeric"
          error={Boolean(errors.launchYear)}
          errorText={errors.launchYear?.message}
          {...register("launchYear")}
        />
      </div>

      {/* row2 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="ceoNameKo"
          size="md"
          labelClassName="text-xs"
          label="대표자 이름 (한국어)"
          placeholder="예: 김도경"
          {...register("ceoNameKo")}
        />
        <Input
          id="ceoNameEn"
          size="md"
          labelClassName="text-xs"
          label="대표자 이름 (영어)"
          placeholder="예: Dokyoung Kim"
          {...register("ceoNameEn")}
        />
      </div>
      {/* row3 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="hqWebsite"
          size="md"
          labelClassName="text-xs"
          label="본사 홈페이지"
          placeholder="예: rollingpasta.ai"
          {...register("hqWebsite")}
        />
        <Input
          id="hqEmail"
          size="md"
          labelClassName="text-xs"
          label="본사 대표 이메일"
          placeholder="예: hq@rollingpasta.com"
          error={Boolean(errors.hqEmail)}
          errorText={errors.hqEmail?.message}
          {...register("hqEmail")}
        />
      </div>

      {/* row4 — 전체폭 */}
      <Input
        id="hqAddress"
        size="md"
        labelClassName="text-xs"
        label="본사 주소"
        placeholder="예: 서울시 강남구 테헤란로 123, 4층"
        {...register("hqAddress")}
      />
    </SettingsSection>
  );
}
