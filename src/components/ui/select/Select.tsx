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

      <ShadcnSelect value={value} onValueChange={onValueChange}>
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
