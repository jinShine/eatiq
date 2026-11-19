import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Input, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandBasic } from "@services/api/brand/brand.query";
import { type BrandBasicData, type UpdateBrandBasicRequest } from "@services/api/brand/brand.type";

import { isUrl } from "@utils/functions";

import useClearOnFormChange from "../../_hooks/useClearOnFormChange";
import { numberOrNull, textOrNull } from "./clearable";

/**
 * 폼 필드 이름은 저장 DTO(UpdateBrandBasicDto)와 같다.
 *
 * 완성도 API의 field_key가 이 이름을 가리켜 저니 패널에서 입력칸으로 바로 포커스할 수 있다.
 *
 * 모든 칸이 선택 입력이다(2026-11-19 서버 필수 해제). 입력칸은 전부 문자열로 받고 연도만 숫자로 바꾼다.
 */
// 글자 수 제한은 서버 검증과 같다(스펙에 없어 400 응답으로 확인)
const maxLength = (max: number) => `${max}자 이내로 입력해주세요`;

const basicInfoSchema = z.object({
  brand_name_ko: z.string().trim().max(100, maxLength(100)),
  brand_name_en: z.string().trim().max(100, maxLength(100)),
  // 서버 검증 범위(1900~2100)와 맞춘다. 스펙에는 범위가 적혀 있지 않아 400 응답으로 확인했다
  launch_year: z.string().refine(v => !v || (/^\d{4}$/.test(v) && Number(v) >= 1900 && Number(v) <= 2100), {
    message: "1900~2100 사이 연도를 입력해주세요",
  }),
  ceo_name_ko: z.string().trim().max(50, maxLength(50)),
  ceo_name_en: z.string().trim().max(100, maxLength(100)),
  homepage_url: z
    .string()
    .trim()
    .max(255, maxLength(255))
    .refine(value => !value || isUrl(value), "올바른 URL 형식이 아니에요"),
  // 공백을 먼저 지운 뒤 검사한다(붙여넣기로 끝에 공백이 붙는 경우). 비어 있으면 통과 — 선택 항목
  official_email: z
    .string()
    .trim()
    .refine(value => !value || z.string().email().safeParse(value).success, "올바른 이메일 형식이 아니에요"),
  official_address: z.string().trim().max(255, maxLength(255)),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

const EMPTY_VALUES: BasicInfoFormValues = {
  brand_name_ko: "",
  brand_name_en: "",
  launch_year: "",
  ceo_name_ko: "",
  ceo_name_en: "",
  homepage_url: "",
  official_email: "",
  official_address: "",
};

/** 저장값 → 폼. 서버의 null·undefined는 빈 입력칸으로 */
const toFormValues = (saved: BrandBasicData): BasicInfoFormValues => ({
  brand_name_ko: saved.brand_name_ko ?? "",
  brand_name_en: saved.brand_name_en ?? "",
  launch_year: saved.launch_year ? String(saved.launch_year) : "",
  ceo_name_ko: saved.ceo_name_ko ?? "",
  ceo_name_en: saved.ceo_name_en ?? "",
  homepage_url: saved.homepage_url ?? "",
  official_email: saved.official_email ?? "",
  official_address: saved.official_address ?? "",
});

/** 폼 → 요청. 빈 칸은 null — 지운 값이 실제로 지워진다(clearable.ts) */
const toRequest = (values: BasicInfoFormValues): UpdateBrandBasicRequest => ({
  brand_name_ko: textOrNull(values.brand_name_ko),
  brand_name_en: textOrNull(values.brand_name_en),
  launch_year: numberOrNull(values.launch_year),
  ceo_name_ko: textOrNull(values.ceo_name_ko),
  ceo_name_en: textOrNull(values.ceo_name_en),
  homepage_url: textOrNull(values.homepage_url),
  official_email: textOrNull(values.official_email),
  official_address: textOrNull(values.official_address),
});

type BasicInfoSectionProps = {
  workspaceId: string;
};

export default function BasicInfoSection({ workspaceId }: BasicInfoSectionProps) {
  // React Compiler 제외. RHF는 렌더마다 register()가 다시 불려 "화면에 있는 필드" 목록을 채우는 걸 전제한다.
  // 컴파일러가 register() 결과를 메모하면 reset 뒤 그 목록이 빈 채로 남아, 다음 reset이 입력칸을 갱신하지 못한다
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_basic");
  const { mutate: updateBrandBasic, isPending, error, reset: clearSaveError } = useUpdateBrandBasic(workspaceId);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: BasicInfoFormValues) => {
    updateBrandBasic(toRequest(values), {
      onSuccess: response => {
        // 서버가 저장한 모양으로 폼을 맞춘다(목 모드는 보낸 값). 이걸 해야 dirty가 풀린다.
        // keepFieldsRef: 필드 ref를 유지한 채 입력칸 값을 직접 바꾼다(values prop 경로와 같은 방식)
        reset(response ? toFormValues(response.brand_basic) : values, { keepFieldsRef: true });
        Toast.success("브랜드 기본 정보를 저장했어요.");
      },
    });
  };

  return (
    <SettingsSection
      title="브랜드 기본 정보"
      description="이름, 런칭 연도, 본사 연락처를 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* row1 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="brand_name_ko"
          size="md"
          labelClassName="text-xs"
          label="브랜드 이름 (한국어)"
          placeholder="예: 롤링 파스타"
          error={Boolean(errors.brand_name_ko)}
          errorText={errors.brand_name_ko?.message}
          {...register("brand_name_ko")}
        />
        <Input
          id="brand_name_en"
          size="md"
          labelClassName="text-xs"
          label="브랜드 이름 (영어)"
          placeholder="예: Rolling Pasta"
          error={Boolean(errors.brand_name_en)}
          errorText={errors.brand_name_en?.message}
          {...register("brand_name_en")}
        />
        <Input
          id="launch_year"
          size="md"
          labelClassName="text-xs"
          label="런칭 연도"
          placeholder="예: 2018"
          inputMode="numeric"
          error={Boolean(errors.launch_year)}
          errorText={errors.launch_year?.message}
          {...register("launch_year")}
        />
      </div>

      {/* row2 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="ceo_name_ko"
          size="md"
          labelClassName="text-xs"
          label="대표자 이름 (한국어)"
          placeholder="예: 김도경"
          error={Boolean(errors.ceo_name_ko)}
          errorText={errors.ceo_name_ko?.message}
          {...register("ceo_name_ko")}
        />
        <Input
          id="ceo_name_en"
          size="md"
          labelClassName="text-xs"
          label="대표자 이름 (영어)"
          placeholder="예: Dokyoung Kim"
          error={Boolean(errors.ceo_name_en)}
          errorText={errors.ceo_name_en?.message}
          {...register("ceo_name_en")}
        />
      </div>
      {/* row3 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="homepage_url"
          size="md"
          labelClassName="text-xs"
          label="본사 홈페이지"
          placeholder="예: rollingpasta.ai"
          error={Boolean(errors.homepage_url)}
          errorText={errors.homepage_url?.message}
          {...register("homepage_url")}
        />
        <Input
          id="official_email"
          size="md"
          labelClassName="text-xs"
          label="본사 대표 이메일"
          placeholder="예: hq@rollingpasta.com"
          error={Boolean(errors.official_email)}
          errorText={errors.official_email?.message}
          {...register("official_email")}
        />
      </div>

      {/* row4 — 전체폭 */}
      <Input
        id="official_address"
        size="md"
        labelClassName="text-xs"
        label="본사 주소"
        placeholder="예: 서울시 강남구 테헤란로 123, 4층"
        error={Boolean(errors.official_address)}
        errorText={errors.official_address?.message}
        {...register("official_address")}
      />
    </SettingsSection>
  );
}
