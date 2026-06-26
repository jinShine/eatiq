import { Skeleton as ShadcnSkeleton } from "@components/shadcn/skeleton";

export default function Skeleton({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <ShadcnSkeleton {...props} />;
}
