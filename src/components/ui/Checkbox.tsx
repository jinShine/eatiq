import type * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { Checkbox as ShadcnCheckbox } from "@components/shadcn/checkbox";

import { cn } from "@utils/shadcn";

import { Box } from "./Container";

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  id?: string;
  label?: string | React.ReactNode;
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
};

export default function Checkbox({ id, label, className, labelClassName, ...props }: CheckboxProps) {
  return (
    <Box className={"flex items-start w-auto gap-1"}>
      <ShadcnCheckbox id={id} className={cn("w-4 h-4", className)} {...props} />
      {label && (
        <label htmlFor={id} className={cn("text-sm leading-none", labelClassName)}>
          {label}
        </label>
      )}
    </Box>
  );
}
