"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Input, Toast } from "@components/ui";

import { useBrandSettings, useUpdateBrandContract } from "@services/api/brand/brand.query";
import { type BrandContract, type UpdateContractRequest } from "@services/api/brand/brand.type";

import SettingsSection from "../SettingsSection";

const contractSchema = z.object({
  contractContactNameKo: z.string(),
  contractContactNameEn: z.string(),
  contractContactTitle: z.string(),
  contractContactEmail: z.union([z.string().email("올바른 이메일 형식이 아니에요"), z.literal("")]),
});

type ContractFormValues = z.infer<typeof contractSchema>;

const EMPTY_VALUES: ContractFormValues = {
  contractContactNameKo: "",
  contractContactNameEn: "",
  contractContactTitle: "",
  contractContactEmail: "",
};

const toFormValues = (contract: BrandContract): ContractFormValues => ({
  contractContactNameKo: contract.contractContactNameKo ?? "",
  contractContactNameEn: contract.contractContactNameEn ?? "",
  contractContactTitle: contract.contractContactTitle ?? "",
  contractContactEmail: contract.contractContactEmail ?? "",
});

type ContractSectionProps = {
  workspaceId: string;
};

export default function ContractSection({ workspaceId }: ContractSectionProps) {
  const { data: settings } = useBrandSettings(workspaceId);
  const { mutate: updateBrandContract, isPending } = useUpdateBrandContract(workspaceId);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: EMPTY_VALUES,
    values: settings?.brandContract ? toFormValues(settings.brandContract) : undefined,
  });

  const onSubmit = (values: ContractFormValues) => {
    // /contract는 전체 치환이라 서명권자 필드도 함께 보내야 유실되지 않는다
    const body: UpdateContractRequest = {
      ...values,
      signatoryNameKo: settings?.brandContract?.signatoryNameKo ?? "",
      signatoryNameEn: settings?.brandContract?.signatoryNameEn ?? "",
      signatoryTitle: settings?.brandContract?.signatoryTitle ?? "",
      signatoryEmail: settings?.brandContract?.signatoryEmail ?? "",
    };

    updateBrandContract(body, {
      onSuccess: () => Toast.success("계약 담당자 정보를 저장했어요."),
      onError: () => Toast.error("저장에 실패했어요. 다시 시도해주세요."),
    });
  };

  return (
    <SettingsSection
      title="계약 담당자 정보"
      description="계약 담당자의 정보를 입력해주세요"
      isDirty={isDirty}
      isPending={isPending}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="contractContactNameKo"
          size="md"
          labelClassName="text-xs"
          label="담당자 이름 (한국어)"
          placeholder="예: 김도경"
          {...register("contractContactNameKo")}
        />
        <Input
          id="contractContactNameEn"
          size="md"
          labelClassName="text-xs"
          label="담당자 이름 (영어)"
          placeholder="예: Volt Kim"
          {...register("contractContactNameEn")}
        />
        <Input
          id="contractContactTitle"
          size="md"
          labelClassName="text-xs"
          label="담당자 직책"
          placeholder="예: 대리"
          {...register("contractContactTitle")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id="contractContactEmail"
          size="md"
          labelClassName="text-xs"
          label="본사 대표 이메일"
          placeholder="예: hq@rollingpasta.com"
          error={Boolean(errors.contractContactEmail)}
          errorText={errors.contractContactEmail?.message}
          {...register("contractContactEmail")}
        />
      </div>
    </SettingsSection>
  );
}
