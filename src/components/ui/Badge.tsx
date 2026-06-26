import { type BadgeProps, Badge as ShadcnBadge } from "@components/shadcn/badge";

export default function Badge({ ...props }: BadgeProps) {
  return <ShadcnBadge {...props} />;
}
