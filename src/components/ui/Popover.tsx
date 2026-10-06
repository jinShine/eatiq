import {
  Popover as ShdcnPopover,
  PopoverContent as ShdcnPopoverContent,
  PopoverTrigger as ShdcnPopoverTrigger,
} from "@components/shadcn/popover";

import { cn } from "@utils/shadcn";

import { triggerChild } from "./triggerChild";

type PopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
} & React.ComponentProps<typeof ShdcnPopover>;

export default function Popover({
  trigger,
  className,
  children,
  align = "start",
  side = "bottom",
  isOpen,
  onOpenChange,
  ...props
}: PopoverProps) {
  return (
    <ShdcnPopover modal={false} open={isOpen} onOpenChange={onOpenChange} {...props}>
      {/* 넘긴 버튼에 바로 붙인다 → triggerChild 주석 참고 */}
      <ShdcnPopoverTrigger asChild>{triggerChild(trigger)}</ShdcnPopoverTrigger>
      <ShdcnPopoverContent className={cn("w-fit p-0 bg-transparent border-none", className)} align={align} side={side}>
        {children}
      </ShdcnPopoverContent>
    </ShdcnPopover>
  );
}
