import { cn } from "@utils/shadcn";

import Input, { type InputProps } from "./Input";

export default function NumberInput({
  label,
  labelClassName,
  required,
  helperText,
  helperTextClassName,
  error,
  errorText,
  errorTextClassName,
  className,
  ...props
}: InputProps) {
  return (
    <Input
      type="number"
      inputMode="numeric"
      label={label}
      labelClassName={labelClassName}
      required={required}
      helperText={helperText}
      helperTextClassName={helperTextClassName}
      error={error}
      errorText={errorText}
      errorTextClassName={errorTextClassName}
      className={cn(
        "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        className,
      )}
      {...props}
    />
  );
}
