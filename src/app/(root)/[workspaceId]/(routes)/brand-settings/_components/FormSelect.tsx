"use client";

import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import { Select, SelectItem } from "@components/ui";

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: readonly { value: string; label: string }[];
  /** 값이 바뀔 때 폼 외 부수 작업이 필요한 경우 (예: 국가 변경 시 도시 초기화) */
  onValueChange?: (value: string) => void;
};

// Select는 제어형이라 register가 아닌 Controller로 연결한다
export default function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "선택해주세요",
  options,
  onValueChange,
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        // Select에는 error prop이 없어 검증 메시지를 직접 붙인다
        <div className="flex flex-col gap-1.5">
          <Select
            size="md"
            labelClassName="text-xs"
            label={label}
            placeholder={placeholder}
            value={field.value}
            onValueChange={value => {
              field.onChange(value);
              onValueChange?.(value);
            }}
          >
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
          {fieldState.error && <p className="text-error text-xs">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
}
