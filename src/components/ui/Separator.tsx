"use client";

import type * as SeparatorPrimitive from "@radix-ui/react-separator";

import { Separator as ShadcnSeparator } from "@components/shadcn/separator";

export default function Separator({ ...props }: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return <ShadcnSeparator {...props} />;
}
