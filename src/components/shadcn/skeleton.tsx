import { cn } from "@/utils/shadcn/index";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-gray-300", className)} {...props} />;
}

export { Skeleton };
