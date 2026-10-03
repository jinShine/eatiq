"use client";

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

// MultiSelect는 배열 값을 제어형으로 다루므로 Controller로 연결한다
export default function FormMultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "선택해주세요",
  options,
  maxCount = 3,
}: FormMultiSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col">
          <Text className="mb-[6px] text-xs font-semibold">{label}</Text>
          <MultiSelect
            size="md"
            options={[...options]}
            placeholder={placeholder}
            maxCount={maxCount}
            name={field.name} // 저니 패널이 [name=...]으로 포커스한다
            value={field.value ?? []}
            onValueChange={field.onChange}
          />
          {fieldState.error && <Text className="text-error mt-[4px] text-xs">{fieldState.error.message}</Text>}
        </div>
      )}
    />
  );
}
