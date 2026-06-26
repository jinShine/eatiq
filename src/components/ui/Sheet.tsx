"use client";

import * as React from "react";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { type VariantProps, cva } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@utils/shadcn";

import { HStack } from "./Container";

export interface SheetProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  header?: React.ReactNode;
  footer?: React.ReactNode;

  showCloseButton?: boolean;
  isDismissable?: boolean;
}

function Sheet({
  trigger,
  children,
  className,
  side,
  isOpen,
  onOpenChange,

  header,
  footer,

  showCloseButton = true,
  isDismissable = true,
}: SheetProps) {
  return (
    <SheetPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <SheetPrimitive.Trigger asChild>
        <div>{trigger}</div>
      </SheetPrimitive.Trigger>
      <SheetContent
        className={className}
        side={side}
        header={header}
        footer={footer}
        showCloseButton={showCloseButton}
        isDismissable={isDismissable}
      >
        {children}
      </SheetContent>
    </SheetPrimitive.Root>
  );
}

/** ******************************************************************** */
/* Helper Components
/********************************************************************** */

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 flex flex-col justify-between bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps & {
    showCloseButton?: boolean;
    isDismissable?: boolean;

    header?: React.ReactNode;
    footer?: React.ReactNode;
  }
>(
  (
    { side = "right", className, children, header, footer, showCloseButton = true, isDismissable = true, ...props },
    ref,
  ) => (
    <SheetPortal>
      <SheetOverlay />

      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        onPointerDownOutside={e => {
          if (!isDismissable) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={e => {
          if (!isDismissable) {
            e.preventDefault();
          }
        }}
        {...props}
      >
        <VisuallyHidden.Root>
          <SheetTitle>Sheet</SheetTitle>
        </VisuallyHidden.Root>
        <div className="sticky top-0 z-10 p-3">
          <HStack className="h-fit justify-between items-center gap-4">
            {header || <div className="w-full h-full">{""}</div>}
            {showCloseButton && (
              <SheetPrimitive.Close className="shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetPrimitive.Close>
            )}
          </HStack>
        </div>
        <div className={cn("w-full p-3 overflow-y-auto flex-1", className)}>{children}</div>
        <div className="sticky bottom-0 z-10 p-3">{footer}</div>
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetClose = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close>
>(({ asChild = true, ...props }, ref) => <SheetPrimitive.Close ref={ref} asChild={asChild} {...props} />);
SheetClose.displayName = SheetPrimitive.Close.displayName;

export { Sheet, SheetClose, SheetTitle };
