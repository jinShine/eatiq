import { Spinner } from "@components/shadcn/spinner";

import { cn } from "@utils/shadcn";

type SpinLoaderProps = React.ComponentProps<"svg"> & {
  size?: "sm" | "md" | "lg";
};

export default function SpinLoader({ size = "md", className, ...props }: SpinLoaderProps) {
  const spinnerSize = size === "sm" ? "size-4" : size === "md" ? "size-6" : "size-10";
  return <Spinner className={cn(spinnerSize, className)} {...props} />;
}
