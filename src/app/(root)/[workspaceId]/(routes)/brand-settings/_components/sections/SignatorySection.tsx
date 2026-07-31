"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandContract } from "@services/api/brand/brand.query";
import { type BrandContract, type UpdateContractRequest } from "@services/api/brand/brand.type";

import SettingsSection from "../SettingsSection";

const signatorySchema = z.object({
  signatoryNameKo: z.string(),
  signatoryNameEn: z.string(),
  signatoryTitle: z.string(),
  signatoryEmail: z.union([z.string().email("올바른 이메일 형식이 아니에요"), z.literal("")]),
});

type SignatoryFormValues = z.infer<typeof signatorySchema>;

const EMPTY_VALUES: SignatoryFormValues = {
  signatoryNameKo: "",
  signatoryNameEn: "",
  signatoryTitle: "",
  signatoryEmail: "",
};

const toFormValues = (contract: BrandContract): SignatoryFormValues => ({
  signatoryNameKo: contract.signatoryNameKo ?? "",
  signatoryNameEn: contract.signatoryNameEn ?? "",
  signatoryTitle: contract.signatoryTitle ?? "",
  signatoryEmail: contract.signatoryEmail ?? "",
});

type SignatorySectionProps = {
  workspaceId: string;
};

export default function SignatorySection({ workspaceId }: SignatorySectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateBrandContract, isPending } = useUpdateBrandContract(workspaceId);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SignatoryFormValues>({
    resolver: zodResolver(signatorySchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandContract ? toFormValues(settings.brandContract) : undefined,
  });

  const onSubmit = (values: SignatoryFormValues) => {
    // /contract는 전체 치환이라 계약 담당자 필드도 함께 보내야 유실되지 않는다
    const body: UpdateContractRequest = {
      ...values,
      contractContactNameKo: settings?.brandContract?.contractContactNameKo ?? "",
      contractContactNameEn: settings?.brandContract?.contractContactNameEn ?? "",
      contractContactTitle: settings?.brandContract?.contractContactTitle ?? "",
      contractContactEmail: settings?.brandContract?.contractContactEmail ?? "",
    };

    updateBrandContract(body, {
      onSuccess: () => Toast.success("서명권자 정보를 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="서명권자 정보"
      description="서명권자의 정보를 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="signatoryNameKo"
          size="md"
          labelClassName="text-xs"
          label="서명권자 이름 (한국어)"
          placeholder="미등록"
          {...register("signatoryNameKo")}
        />
        <Input
          id="signatoryNameEn"
          size="md"
          labelClassName="text-xs"
          label="서명권자 이름 (영어)"
          placeholder="미등록"
          {...register("signatoryNameEn")}
        />
        <Input
          id="signatoryTitle"
          size="md"
          labelClassName="text-xs"
          label="서명권자 직책"
          placeholder="미등록"
          {...register("signatoryTitle")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="signatoryEmail"
          size="md"
          labelClassName="text-xs"
          label="본사 대표 이메일"
          placeholder="미등록"
          error={Boolean(errors.signatoryEmail)}
          errorText={errors.signatoryEmail?.message}
          {...register("signatoryEmail")}
        />
      </div>
    </SettingsSection>
  );
}
