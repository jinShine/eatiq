"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { SettingsSection } from "@components/custom/settings";
import { Input, Toast } from "@components/ui";

import { useBuyerSection, useUpdateBuyerContact } from "@services/api/buyer/buyer.query";
import { type BuyerContactData, type UpdateBuyerContactRequest } from "@services/api/buyer/buyer.type";

import useClearOnFormChange from "../../../_hooks/useClearOnFormChange";
import FormMultiSelect, { toTags } from "../../FormMultiSelect";
import { CONTACT_LANGUAGE_VALUES, toOptions } from "../../sections/IntroOptions";

/**
 * 연락처 (피그마 961:10022) — PUT /buyer/contact. 폼 필드 이름은 저장 DTO와 같다.
 * 서버 규칙(400 응답으로 확인): 담당자 이름 필수 100자, 직책 필수 50자, 이메일 필수(형식), 가능 언어 선택.
 * 가능 언어는 스펙에 선택지가 없어(자유 문자열 배열) 브랜드 연락처와 같은 목록을 쓴다.
 */
const contactSchema = z.object({
  contact_name: z.string().trim().min(1, "담당자 이름을 입력해주세요").max(100, "100자 이내로 입력해주세요"),
  contact_position: z.string().trim().min(1, "직책을 입력해주세요").max(50, "50자 이내로 입력해주세요"),
  contact_email: z.string().trim().min(1, "이메일을 입력해주세요").email("올바른 이메일 형식이 아니에요"),
  contact_languages: z.array(z.string()),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const EMPTY_VALUES: ContactFormValues = {
  contact_name: "",
  contact_position: "",
  contact_email: "",
  contact_languages: [],
};

const toFormValues = (saved: BuyerContactData): ContactFormValues => ({
  contact_name: saved.contact_name ?? "",
  contact_position: saved.contact_position ?? "",
  contact_email: saved.contact_email ?? "",
  contact_languages: toTags(saved.contact_languages),
});

const toRequest = (values: ContactFormValues): UpdateBuyerContactRequest => ({
  contact_name: values.contact_name.trim(),
  contact_position: values.contact_position.trim(),
  contact_email: values.contact_email.trim(),
  contact_languages: values.contact_languages,
});

type BuyerContactSectionProps = {
  workspaceId: string;
};

export default function BuyerContactSection({ workspaceId }: BuyerContactSectionProps) {
  // React Compiler 제외 → BasicInfoSection 주석 참고
  "use no memo";

  const { data: saved } = useBuyerSection(workspaceId, "buyer_contact");
  const { mutate: updateBuyerContact, isPending, error, reset: clearSaveError } = useUpdateBuyerContact(workspaceId);

  const {
    control,
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: EMPTY_VALUES,
    values: saved ? toFormValues(saved) : undefined,
  });

  useClearOnFormChange(watch, clearSaveError);

  const onSubmit = (values: ContactFormValues) => {
    updateBuyerContact(toRequest(values), {
      onSuccess: response => {
        reset(response ? toFormValues(response.buyer_contact) : values, { keepFieldsRef: true });
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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          id="contact_name"
          size="md"
          labelClassName="text-xs"
          label="담당자 이름"
          required
          placeholder="예: James Park"
          error={Boolean(errors.contact_name)}
          errorText={errors.contact_name?.message}
          {...register("contact_name")}
        />
        <Input
          id="contact_position"
          size="md"
          labelClassName="text-xs"
          label="직책"
          required
          placeholder="예: 대리"
          error={Boolean(errors.contact_position)}
          errorText={errors.contact_position?.message}
          {...register("contact_position")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          id="contact_email"
          size="md"
          labelClassName="text-xs"
          label="담당자 이메일"
          required
          placeholder="예: minsoo.park@rollingpasta.com"
          error={Boolean(errors.contact_email)}
          errorText={errors.contact_email?.message}
          {...register("contact_email")}
        />
        <FormMultiSelect
          control={control}
          name="contact_languages"
          label="가능 언어"
          placeholder="언어를 선택해주세요"
          options={toOptions(CONTACT_LANGUAGE_VALUES)}
        />
      </div>
    </SettingsSection>
  );
}
