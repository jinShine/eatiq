"use client";

import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import { Select, SelectItem } from "@components/ui";

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: readonly { value: string; label: string }[];
};

// Select는 제어형이라 register가 아닌 Controller로 연결한다
export default function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "선택해주세요",
  options,
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          size="md"
          labelClassName="text-xs"
          label={label}
          placeholder={placeholder}
          value={field.value}
          onValueChange={field.onChange}
        >
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      )}
    />
  );
}
