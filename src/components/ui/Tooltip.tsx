import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "@components/shadcn/tooltip";

import { cn } from "@utils/shadcn";

type TooltipProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export default function Tooltip({ trigger, children, placement = "top", className }: TooltipProps) {
  return (
    <ShadcnTooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side={placement} className={cn("z-50", className)}>
        {children}
      </TooltipContent>
    </ShadcnTooltip>
  );
}
