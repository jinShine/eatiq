import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { Input } from "@components/ui";

import { type ContractPersonFormValues } from "./contractPersonForm";

type ContractPersonFieldsProps = {
  /** 입력칸 id 접두사 — 두 섹션이 한 화면에 있어 id가 겹치지 않게 한다(name은 DTO 필드명 그대로) */
  idPrefix: string;
  /** 라벨 앞말 — "담당자" / "서명권자" */
  role: string;
  register: UseFormRegister<ContractPersonFormValues>;
  errors: FieldErrors<ContractPersonFormValues>;
  placeholders: Record<keyof ContractPersonFormValues, string>;
};

/** 계약 담당자·서명권자 섹션의 입력칸 4개 (피그마 195:7609 · 195:7649 배치: 3열 + 이메일 1열) */
export default function ContractPersonFields({
  idPrefix,
  role,
  register,
  errors,
  placeholders,
}: ContractPersonFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          id={`${idPrefix}_name_ko`}
          size="md"
          labelClassName="text-xs"
          label={`${role} 이름 (한국어)`}
          required
          placeholder={placeholders.name_ko}
          error={Boolean(errors.name_ko)}
          errorText={errors.name_ko?.message}
          {...register("name_ko")}
        />
        <Input
          id={`${idPrefix}_name_en`}
          size="md"
          labelClassName="text-xs"
          label={`${role} 이름 (영어)`}
          required
          placeholder={placeholders.name_en}
          error={Boolean(errors.name_en)}
          errorText={errors.name_en?.message}
          {...register("name_en")}
        />
        <Input
          id={`${idPrefix}_position`}
          size="md"
          labelClassName="text-xs"
          label={`${role} 직책`}
          required
          placeholder={placeholders.position}
          error={Boolean(errors.position)}
          errorText={errors.position?.message}
          {...register("position")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* 시안 라벨은 "본사 대표 이메일"이지만, API가 받는 값은 이 사람의 이메일이다 — 디자인 확인 요청 */}
        <Input
          id={`${idPrefix}_email`}
          size="md"
          labelClassName="text-xs"
          label={`${role} 이메일`}
          required
          placeholder={placeholders.email}
          error={Boolean(errors.email)}
          errorText={errors.email?.message}
          {...register("email")}
        />
      </div>
    </>
  );
}
