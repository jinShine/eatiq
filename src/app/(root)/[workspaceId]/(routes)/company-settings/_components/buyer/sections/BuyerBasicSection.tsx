"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Input, Toast } from "@components/ui";

import { useBuyerSection, useUpdateBuyerBasic } from "@services/api/buyer/buyer.query";
import { type BuyerBasicData, type UpdateBuyerBasicRequest } from "@services/api/buyer/buyer.type";

import { isUrl } from "@utils/functions";

import useClearOnFormChange from "../../../_hooks/useClearOnFormChange";

/**
 * 회사 기본 정보 (피그마 961:10022) — PUT /buyer/basic. 폼 필드 이름은 저장 DTO와 같다 → BasicInfoSection 주석 참고.
 *
 * 서버 규칙(400 응답으로 확인): 회사명 필수 100자, 설립 연도 1800~2100, 사업 유형·대표자·국가·도시 100자,
 * 주소 255자, 홈페이지 URL·이메일 형식. 시안의 「런칭 연도」는 API에 없어 뺐다.
 * TODO(백엔드): 사업 유형·운영 국가·운영 도시는 시안대로 선택 박스가 된다(선택지 추가 예정). 지금은 자유 입력
 */
const maxLength = (max: number) => `${max}자 이내로 입력해주세요`;

const basicSchema = z.object({
  company_name: z.string().trim().min(1, "회사명을 입력해주세요").max(100, maxLength(100)),
  founded_year: z.string().refine(v => !v || (/^\d{4}$/.test(v) && Number(v) >= 1800 && Number(v) <= 2100), {
    message: "1800~2100 사이 연도를 입력해주세요",
  }),
  business_type: z.string().trim().max(100, maxLength(100)),
  ceo_name: z.string().trim().max(100, maxLength(100)),
  country: z.string().trim().max(100, maxLength(100)),
  city: z.string().trim().max(100, maxLength(100)),
  homepage_url: z
    .string()
    .trim()
    .refine(value => !value || isUrl(value), "올바른 URL 형식이 아니에요"),
  official_email: z
    .string()
    .trim()
    .refine(value => !value || z.string().email().safeParse(value).success, "올바른 이메일 형식이 아니에요"),
  official_address: z.string().trim().max(255, maxLength(255)),
});

type BasicFormValues = z.infer<typeof basicSchema>;

const EMPTY_VALUES: BasicFormValues = {
  company_name: "",
  founded_year: "",
  business_type: "",
  ceo_name: "",
  country: "",
  city: "",
  homepage_url: "",
  official_email: "",
  official_address: "",
};

const toFormValues = (saved: BuyerBasicData): BasicFormValues => ({
  company_name: saved.company_name ?? "",
  founded_year: saved.founded_year ? String(saved.founded_year) : "",
  business_type: saved.business_type ?? "",
  ceo_name: saved.ceo_name ?? "",
  country: saved.country ?? "",
  city: saved.city ?? "",
  homepage_url: saved.homepage_url ?? "",
  official_email: saved.official_email ?? "",
  official_address: saved.official_address ?? "",
});

/** 폼 → 요청. 빈 선택 항목은 보내지 않는다(빈 문자열은 형식 검증에 걸린다) */
const toRequest = (values: BasicFormValues): UpdateBuyerBasicRequest => {
  const optional = (value: string) => value.trim() || undefined;

  return {
    company_name: values.company_name.trim(),
    founded_year: values.founded_year ? Number(values.founded_year) : undefined,
    business_type: optional(values.business_type),
    ceo_name: optional(values.ceo_name),
    country: optional(values.country),
    city: optional(values.city),
    homepage_url: optional(values.homepage_url),
    official_email: optional(values.official_email),
    official_address: optional(values.official_address),
  };
};

type BuyerBasicSectionProps = {
  workspaceId: string;
};

export default function BuyerBasicSection({ workspaceId }: BuyerBasicSectionProps) {
  // React Compiler 제외 → BasicInfoSection 주석 참고
  "use no memo";

  const { data: saved } = useBuyerSection(workspaceId, "buyer_basic");
  const { mutate: updateBuyerBasic, isPending, error, reset: clearSaveError } = useUpdateBuyerBasic(workspaceId);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BasicFormValues>({
    resolver: zodResolver(basicSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: BasicFormValues) => {
    updateBuyerBasic(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.buyer_basic) : values, { keepFieldsRef: true });
        Toast.success("회사 기본 정보를 저장했어요.");
      },
    });
  };

  const field = (name: keyof BasicFormValues) => ({
    id: name,
    size: "md" as const,
    labelClassName: "text-xs",
    error: Boolean(errors[name]),
    errorText: errors[name]?.message,
    ...register(name),
  });

  return (
    <SettingsSection
      title="회사 기본 정보"
      description="이름, 설립 연도, 본사 연락처를 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input label="회사명" required placeholder="예: 롤링 인베스트먼트" {...field("company_name")} />
        <Input label="설립 연도" placeholder="예: 2018" inputMode="numeric" {...field("founded_year")} />
        <Input label="사업 유형" placeholder="예: 외식 체인 운영사" {...field("business_type")} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input label="대표자 이름" placeholder="예: 김도경" {...field("ceo_name")} />
        <Input label="운영 국가" placeholder="예: 일본" {...field("country")} />
        <Input label="운영 도시" placeholder="예: 도쿄" {...field("city")} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input label="본사 홈페이지" placeholder="예: rollingpasta.ai" {...field("homepage_url")} />
        <Input label="본사 대표 이메일" placeholder="예: hq@rollingpasta.com" {...field("official_email")} />
      </div>

      <Input label="본사 주소" placeholder="예: 서울시 강남구 테헤란로 123, 4층" {...field("official_address")} />
    </SettingsSection>
  );
}
