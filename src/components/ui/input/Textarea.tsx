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
  return (
    <VStack>
      {label && (
        <Text className={cn("text-sm font-semibold mb-[6px]", labelClassName)}>
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </Text>
      )}
      <ShadcnTextarea
        className={cn(
          error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          props.className,
        )}
        {...props}
      />
      {error ? (
        <Text className={cn("text-xs text-error font-normal mt-[4px] line-clamp-2", errorTextClassName)}>
          {errorText}
        </Text>
      ) : helperText ? (
        <Text className={cn("text-xs text-text-tertiary font-normal mt-[4px] line-clamp-2", helperTextClassName)}>
          {helperText}
        </Text>
      ) : null}
    </VStack>
  );
}
