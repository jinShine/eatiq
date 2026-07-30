import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandContact } from "@services/api/brand/brand.query";
import { type BrandContact, type UpdateContactRequest } from "@services/api/brand/brand.type";

import SettingsSection from "../SettingsSection";

const contactSchema = z.object({
  contactNameKo: z.string(),
  contactNameEn: z.string(),
  contactTitle: z.string(),
  contactEmail: z.union([z.string().email("올바른 이메일 형식이 아니에요"), z.literal("")]),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const EMPTY_VALUES: ContactFormValues = {
  contactNameKo: "",
  contactNameEn: "",
  contactTitle: "",
  contactEmail: "",
};

const toFormValues = (contact: BrandContact): ContactFormValues => ({
  contactNameKo: contact.contactNameKo ?? "",
  contactNameEn: contact.contactNameEn ?? "",
  contactTitle: contact.contactTitle ?? "",
  contactEmail: contact.contactEmail ?? "",
});

const toRequest = (values: ContactFormValues): UpdateContactRequest => ({ ...values });

type ContactSectionProps = {
  workspaceId: string;
};

export default function ContactSection({ workspaceId }: ContactSectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateBrandContact, isPending } = useUpdateBrandContact(workspaceId);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandContact ? toFormValues(settings.brandContact) : undefined,
  });

  const onSubmit = (values: ContactFormValues) => {
    updateBrandContact(toRequest(values), {
      onSuccess: () => Toast.success("연락처를 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="연락처"
      description="담당자의 정보를 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* row1 — 3열 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="contactNameKo"
          size="md"
          labelClassName="text-xs"
          label="담당자 이름 (한국어)"
          placeholder="예: 박민수"
          {...register("contactNameKo")}
        />
        <Input
          id="contactNameEn"
          size="md"
          labelClassName="text-xs"
          label="담당자 이름 (영어)"
          placeholder="예: Minsoo Park"
          {...register("contactNameEn")}
        />
        <Input
          id="contactTitle"
          size="md"
          labelClassName="text-xs"
          label="직책"
          placeholder="예: 대리"
          {...register("contactTitle")}
        />
      </div>

      {/* row2 — 2열 (가능 언어는 배열이라 코드값 확정 후 추가) */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          id="contactEmail"
          size="md"
          labelClassName="text-xs"
          label="담당자 이메일"
          placeholder="예: minsoo.park@rollingpasta.com"
          error={Boolean(errors.contactEmail)}
          errorText={errors.contactEmail?.message}
          {...register("contactEmail")}
        />
        {/* TODO: 가능 언어(contactLanguages, 배열) — 서버 코드값 확정 후 MultiSelect 추가 */}
      </div>
    </SettingsSection>
  );
}
