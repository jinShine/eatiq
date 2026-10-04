import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Input, Toast } from "@components/ui";

import { useBrandSection, useUpdateBrandContact } from "@services/api/brand/brand.query";
import { type BrandContactData, type UpdateBrandContactRequest } from "@services/api/brand/brand.type";

import FormMultiSelect, { toTags } from "../FormMultiSelect";
import { CONTACT_LANGUAGE_VALUES, toOptions } from "./IntroOptions";

/**
 * 폼 필드 이름은 저장 DTO(UpdateBrandContactDto)와 같다. → BasicInfoSection 주석 참고
 * 필수·길이 제한은 서버 검증에 맞췄다(스펙에는 길이가 없어 400 응답으로 확인).
 */
const contactSchema = z.object({
  name_ko: z.string().trim().min(1, "담당자 이름(한국어)을 입력해주세요").max(50, "50자 이내로 입력해주세요"),
  name_en: z.string().trim().min(1, "담당자 이름(영어)을 입력해주세요").max(100, "100자 이내로 입력해주세요"),
  position: z.string().trim().min(1, "직책을 입력해주세요").max(50, "50자 이내로 입력해주세요"),
  email: z.string().trim().min(1, "이메일을 입력해주세요").email("올바른 이메일 형식이 아니에요"),
  languages: z.array(z.string()),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const EMPTY_VALUES: ContactFormValues = {
  name_ko: "",
  name_en: "",
  position: "",
  email: "",
  languages: [],
};

const toFormValues = (saved: BrandContactData): ContactFormValues => ({
  name_ko: saved.name_ko ?? "",
  name_en: saved.name_en ?? "",
  position: saved.position ?? "",
  email: saved.email ?? "",
  languages: toTags(saved.languages),
});

const toRequest = (values: ContactFormValues): UpdateBrandContactRequest => ({
  name_ko: values.name_ko.trim(),
  name_en: values.name_en.trim(),
  position: values.position.trim(),
  email: values.email.trim(),
  languages: values.languages,
});

type ContactSectionProps = {
  workspaceId: string;
};

export default function ContactSection({ workspaceId }: ContactSectionProps) {
  // React Compiler 제외. RHF는 렌더마다 register()가 다시 불려 "화면에 있는 필드" 목록을 채우는 걸 전제한다.
  // 컴파일러가 register() 결과를 메모하면 reset 뒤 그 목록이 빈 채로 남아, 다음 reset이 입력칸을 갱신하지 못한다
  "use no memo";

  const { data: saved } = useBrandSection(workspaceId, "brand_contact");
  const { mutate: updateBrandContact, isPending, error } = useUpdateBrandContact(workspaceId);

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  const onSubmit = (values: ContactFormValues) => {
    updateBrandContact(toRequest(values), {
      onSuccess: response => {
        // 서버가 저장한 모양으로 폼을 맞춘다(목 모드는 보낸 값). 이걸 해야 dirty가 풀린다.
        // keepFieldsRef: 필드 ref를 유지한 채 입력칸 값을 직접 바꾼다(values prop 경로와 같은 방식)
        reset(response ? toFormValues(response.brand_contact) : values, { keepFieldsRef: true });
        Toast.success("연락처를 저장했어요.");
      },
    });
  };

  return (
    <SettingsSection
      title="연락처"
      description="담당자의 정보를 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      errorMessage={error?.message}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* row1 — 3열 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="name_ko"
          size="md"
          labelClassName="text-xs"
          label="담당자 이름 (한국어)"
          required
          placeholder="예: 박민수"
          error={Boolean(errors.name_ko)}
          errorText={errors.name_ko?.message}
          {...register("name_ko")}
        />
        <Input
          id="name_en"
          size="md"
          labelClassName="text-xs"
          label="담당자 이름 (영어)"
          required
          placeholder="예: Minsoo Park"
          error={Boolean(errors.name_en)}
          errorText={errors.name_en?.message}
          {...register("name_en")}
        />
        <Input
          id="position"
          size="md"
          labelClassName="text-xs"
          label="직책"
          required
          placeholder="예: 대리"
          error={Boolean(errors.position)}
          errorText={errors.position?.message}
          {...register("position")}
        />
      </div>

      {/* row2 — 2열 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          id="email"
          size="md"
          labelClassName="text-xs"
          label="담당자 이메일"
          required
          placeholder="예: minsoo.park@rollingpasta.com"
          error={Boolean(errors.email)}
          errorText={errors.email?.message}
          {...register("email")}
        />
        <FormMultiSelect
          control={control}
          name="languages"
          label="가능 언어"
          placeholder="언어를 선택해주세요"
          options={toOptions(CONTACT_LANGUAGE_VALUES)}
        />
      </div>
    </SettingsSection>
  );
}
