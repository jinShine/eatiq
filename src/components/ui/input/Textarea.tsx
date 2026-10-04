import { useId } from "react";

import { Textarea as ShadcnTextarea } from "@components/shadcn/textarea";

import { cn } from "@utils/shadcn";

import { VStack } from "../Container";
import { Text } from "../typography";

type LabelProps = {
  label?: string;
  labelClassName?: string;
  required?: boolean;
};

type OptionsProps = {
  error?: boolean;
  errorText?: string;
  errorTextClassName?: string;
  helperText?: string;
  helperTextClassName?: string;
};

type TextareaProps = React.ComponentProps<"textarea"> & LabelProps & OptionsProps;

export default function Textarea({
  label,
  labelClassName,
  required,
  helperText,
  helperTextClassName,
  error,
  errorText,
  errorTextClassName,
  ...props
}: TextareaProps) {
  // 접근성 — Input과 같은 방식으로 라벨·오류·도움말 문구를 연결한다
  const generatedId = useId();
  const textareaId = props.id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;
  const describedBy = error && errorText ? errorId : helperText ? helperId : undefined;

  return (
    <VStack>
      {label && (
        <Text as="label" htmlFor={textareaId} className={cn("text-sm font-semibold mb-[6px]", labelClassName)}>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-error">
              *
            </span>
          )}
        </Text>
      )}
      <ShadcnTextarea
        className={cn(
          error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          props.className,
        )}
        aria-invalid={error || undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        {...props}
        id={textareaId}
      />
      {error ? (
        <Text id={errorId} className={cn("text-xs text-error font-normal mt-[4px] line-clamp-2", errorTextClassName)}>
          {errorText}
        </Text>
      ) : helperText ? (
        <Text
          id={helperId}
          className={cn("text-xs text-text-tertiary font-normal mt-[4px] line-clamp-2", helperTextClassName)}
        >
          {helperText}
        </Text>
      ) : null}
    </VStack>
  );
}
