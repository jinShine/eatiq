"use client";

import { useId } from "react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import { MultiSelect } from "@components/ui";
import { Text } from "@components/ui/typography";

type FormMultiSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: readonly { value: string; label: string }[];
  maxCount?: number; // 트리거에 표시할 배지 개수
};

/**
 * 저장된 태그 배열 → 폼 값. 빈 문자열 항목은 버린다.
 * 서버가 받아주지만 선택지에 없어 화면에 안 보인 채 다시 저장되고 완성도에도 잡힌다.
 */
export const toTags = (values?: string[] | null) => (values ?? []).filter(value => value.trim());

// MultiSelect는 배열 값을 제어형으로 다루므로 Controller로 연결한다
export default function FormMultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "선택해주세요",
  options,
  maxCount = 3,
}: FormMultiSelectProps<T>) {
  // 접근성 — 라벨을 트리거 버튼에, 검증 문구를 aria-describedby로 연결한다
  const triggerId = useId();
  const errorId = `${triggerId}-error`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col">
          <Text as="label" htmlFor={triggerId} className="mb-[6px] text-xs font-semibold">
            {label}
          </Text>
          <MultiSelect
            size="md"
            options={[...options]}
            placeholder={placeholder}
            maxCount={maxCount}
            id={triggerId}
            name={field.name} // 저니 패널이 [name=...]으로 포커스한다
            aria-invalid={Boolean(fieldState.error) || undefined}
            aria-describedby={fieldState.error ? errorId : undefined}
            value={field.value ?? []}
            onValueChange={field.onChange}
          />
          {fieldState.error && (
            <Text id={errorId} className="text-error mt-[4px] text-xs">
              {fieldState.error.message}
            </Text>
          )}
        </div>
      )}
    />
  );
}
