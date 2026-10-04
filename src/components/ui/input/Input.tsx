import { forwardRef, useId } from "react";

import { Input as ShadcnInput } from "@/components/shadcn/input";

import { cn } from "@utils/shadcn";

import { InputSize, type InputSizeType } from "..";
import { HStack, VStack } from "../Container";
import { Text } from "../typography";

type LabelProps = {
  label?: string | React.ReactNode;
  labelClassName?: string;
  required?: boolean;
};

type OptionsProps = {
  size?: InputSizeType;
  error?: boolean;
  errorText?: string | React.ReactNode;
  errorTextClassName?: string;
  helperText?: string | React.ReactNode;
  helperTextClassName?: string;

  startAdornment?: React.ReactNode;
  externalStartAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  externalEndAdornment?: React.ReactNode;
};

export type InputProps = Omit<React.ComponentProps<"input">, "size"> & LabelProps & OptionsProps;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "lg",
      label,
      labelClassName,
      required,
      helperText,
      helperTextClassName,
      error,
      errorText,
      errorTextClassName,

      startAdornment,
      externalStartAdornment,
      endAdornment,
      externalEndAdornment,

      className,
      ...props
    },
    ref,
  ) => {
    const inputHeight = InputSize[size];
    const labelTextSize = size === "sm" ? "text-xs" : "text-sm";

    // 접근성 — 라벨(<label htmlFor>)과 오류·도움말 문구(aria-describedby)를 입력칸에 연결한다.
    // id를 안 넘긴 곳은 자동 id를 쓴다
    const generatedId = useId();
    const inputId = props.id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const describedBy = error && errorText ? errorId : helperText ? helperId : undefined;

    return (
      <VStack className="w-auto flex-1 justify-start">
        {label && (
          <HStack className="mb-[6px] items-center h-fit">
            {typeof label === "string" ? (
              <Text
                as="label"
                htmlFor={inputId}
                variant="sm"
                className={cn("font-medium", labelTextSize, labelClassName)}
              >
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
        <HStack className="h-fit items-center relative">
          {externalStartAdornment && externalStartAdornment}
          {startAdornment && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10 flex items-center">
              {startAdornment}
            </div>
          )}
          <ShadcnInput
            ref={ref}
            className={cn(
              "shadow-none",
              size === "xl" ? "text-base" : "text-sm",
              inputHeight,
              props.disabled && "bg-secondary-background",
              startAdornment && "pl-10",
              endAdornment && "pr-10",
              error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/50",
              className,
            )}
            autoComplete="off"
            aria-invalid={error || undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            {...props}
            id={inputId}
          />
          {endAdornment && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 flex items-center">
              {endAdornment}
            </div>
          )}
          {externalEndAdornment && externalEndAdornment}
        </HStack>
        {error ? (
          typeof errorText === "string" ? (
            <Text id={errorId} className={cn("text-xs text-error font-normal mt-[4px]", errorTextClassName)}>
              {errorText}
            </Text>
          ) : (
            <div id={errorId} className={cn("mt-[4px]", errorTextClassName)}>
              {errorText}
            </div>
          )
        ) : helperText ? (
          typeof helperText === "string" ? (
            <Text id={helperId} className={cn("text-xs text-text-tertiary font-normal mt-[4px]", helperTextClassName)}>
              {helperText}
            </Text>
          ) : (
            <div id={helperId} className={cn("mt-[4px]", helperTextClassName)}>
              {helperText}
            </div>
          )
        ) : null}
      </VStack>
    );
  },
);

Input.displayName = "Input";

export default Input;
