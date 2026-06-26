import { Switch as ShadcnSwitch } from "@components/shadcn/switch";

import { cn } from "@utils/shadcn";

export default function Switch({ ...props }: React.ComponentProps<typeof ShadcnSwitch>) {
  return <ShadcnSwitch className={cn("", props.className)} {...props} />;
}
