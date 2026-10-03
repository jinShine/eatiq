"use client";

import { useState } from "react";

import Input, { type InputProps } from "./Input";

/** 정수 문자열에 천 단위 쉼표. 숫자가 아니면 그대로 둬서 검증 문구와 함께 원래 입력이 보이게 한다 */
const withComma = (value: string) => (/^\d+$/.test(value) ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : value);

type CommaNumberInputProps = Omit<InputProps, "value" | "onChange" | "type"> & {
  /** 쉼표 없는 원본 값 */
  value: string;
  onChange: (value: string) => void;
};

/**
 * 금액처럼 큰 숫자 입력. 포커스가 없을 때만 쉼표를 보여준다.
 *
 * 입력 중에 쉼표를 끼워 넣으면 커서가 튀어서, 편집할 때는 원본을 보여준다.
 * 값은 항상 쉼표 없는 문자열로 올린다. RHF에서는 Controller로 연결한다.
 * type="number"는 쉼표를 표시할 수 없어 text + inputMode로 둔다.
 */
export default function CommaNumberInput({ value, onChange, onFocus, onBlur, ...props }: CommaNumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Input
      inputMode="numeric"
      {...props}
      value={isFocused ? value : withComma(value)}
      onChange={event => onChange(event.target.value.replace(/,/g, ""))}
      onFocus={event => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onBlur={event => {
        setIsFocused(false);
        onBlur?.(event);
      }}
    />
  );
}
