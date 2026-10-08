import { useId } from "react";

import {
  SelectContent,
  type SelectGroupProps,
  type SelectItemProps,
  type SelectLabelProps,
  type SelectSeparatorProps,
  SelectTrigger,
  type SelectTriggerProps,
  SelectValue,
  Select as ShadcnSelect,
  SelectGroup as ShadcnSelectGroup,
  SelectItem as ShadcnSelectItem,
  SelectLabel as ShadcnSelectLabel,
  SelectSeparator as ShadcnSelectSeparator,
} from "@components/shadcn/select";

import { cn } from "@utils/shadcn";

import { InputSize } from "..";
import { HStack, VStack } from "../Container";
import { Text } from "../typography";

export type SelectProps = {
  label?: string;
  labelClassName?: string;
  required?: boolean;

  value?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
} & SelectTriggerProps;

export function Select({
  label,
  labelClassName,
  required,
  size = "lg",
  value,
  placeholder,
  onValueChange,
  ...props
}: SelectProps) {
  const selectTriggerHeight = InputSize[size];
  // 접근성 — 라벨을 트리거 버튼에 연결한다(라벨이 버튼의 이름이 된다)
  const generatedId = useId();
  const triggerId = props.id ?? generatedId;

  return (
    <VStack className="w-auto flex-1 justify-start">
      {label && (
        <HStack className="mb-[6px] items-center h-fit">
          {typeof label === "string" ? (
            <Text as="label" htmlFor={triggerId} className={cn("text-sm font-semibold", labelClassName)}>
              {label}
              {required && (
                <span aria-hidden="true" className="ml-1 text-error">
                  *
                </span>
              )}
            </Text>
          ) : (
            label
          )}
        </HStack>
      )}

      {/* 빈 값("") 변경은 무시한다. Radix는 폼 안에서 숨은 native <select>를 같이 두고, 값이 바뀌면 거기에도 넣은 뒤
          change를 쏜다. 그 순간 <option>이 아직 없으면 native 값이 ""로 남아, ""가 onValueChange로 되돌아와
          저장된 값을 지운다(캐시된 데이터로 폼이 바로 채워질 때 — 다른 메뉴에 갔다 돌아오면 저장 안 된 변경으로 보였다).
          항목 값은 ""가 될 수 없어(Radix 제약) 사용자가 고른 결과로 ""가 오는 일은 없다. 비우기는 폼 reset·setValue로 한다 */}
      <ShadcnSelect value={value} onValueChange={next => next !== "" && onValueChange?.(next)}>
        <SelectTrigger
          aria-required={required || undefined}
          {...props}
          id={triggerId}
          className={cn(
            "w-full",
            props.disabled && "pointer-events-none bg-secondary-background",
            selectTriggerHeight,
            props.className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{props.children}</SelectContent>
      </ShadcnSelect>
    </VStack>
  );
}

export function SelectGroup({ ...props }: SelectGroupProps) {
  return <ShadcnSelectGroup {...props} />;
}

export function SelectItem({ children, ...props }: SelectItemProps) {
  return <ShadcnSelectItem {...props}>{children}</ShadcnSelectItem>;
}

export function SelectSeparator({ ...props }: SelectSeparatorProps) {
  return <ShadcnSelectSeparator {...props} />;
}

export function SelectLabel({ children, ...props }: SelectLabelProps) {
  return (
    <ShadcnSelectLabel className={cn("text-sm text-text-primary font-semibold", props.className)} {...props}>
      {children}
    </ShadcnSelectLabel>
  );
}
