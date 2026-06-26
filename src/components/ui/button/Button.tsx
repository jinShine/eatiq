import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from "@components/shadcn/button";
import { Spinner } from "@components/shadcn/spinner";

import { cn } from "@utils/shadcn";

export type ButtonProps = ShadcnButtonProps & {
  isLoading?: boolean;
};

export default function Button({ children, isLoading = false, className, ...props }: ButtonProps) {
  return (
    <ShadcnButton
      type={props.type || "button"}
      disabled={isLoading || props.disabled}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          {children}
        </>
      ) : (
        children
      )}
    </ShadcnButton>
  );
}
