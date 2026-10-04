"use client";

import { useId } from "react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import { Select, SelectItem } from "@components/ui";

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: readonly { value: string; label: string }[];
  /** 선행 입력이 없어 아직 고를 수 없는 경우 (예: 국가를 고르기 전의 도시) */
  disabled?: boolean;
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
  disabled,
  onValueChange,
}: FormSelectProps<T>) {
  // 검증 문구를 aria-describedby로 트리거에 연결한다. 같은 필드 이름이 한 화면에 둘 있어도 겹치지 않게 자동 id
  const errorId = useId();

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
            disabled={disabled}
            // 트리거 버튼에 붙는다 — name은 저니 패널 포커스, ref는 제출 실패 시 첫 오류로 포커스,
            // aria-invalid는 shadcn 트리거의 빨간 테두리 스타일
            name={field.name}
            ref={field.ref}
            aria-invalid={Boolean(fieldState.error)}
            aria-describedby={fieldState.error ? errorId : undefined}
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
          {fieldState.error && (
            <p id={errorId} className="text-error text-xs">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
