"use client";

import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@utils/shadcn";

import { triggerChild } from "../triggerChild";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "full";

const sizeClasses: Record<ModalSize, string> = {
  xs: "w-xs",
  sm: "w-sm",
  md: "w-md",
  lg: "w-2xl",
  full: "w-full h-full",
};

type DialogProps = {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: ModalSize;
  isDismissable?: boolean;
  hideCloseButton?: boolean;
};

function Modal({
  trigger,
  children,
  className,
  isOpen,
  onOpenChange,
  size = "md",
  isDismissable = false,
  hideCloseButton = false,
}: DialogProps) {
  // 열 때 포커스가 있던 요소. 트리거 없이(isOpen으로) 연 모달은 닫힐 때 여기로 포커스를 돌려준다
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      {/* 트리거는 넘겼을 때만 만든다. 빈 트리거를 두면 Radix가 닫을 때 그쪽(포커스 불가)으로 포커스를 보내
          body로 빠지고, div에 aria-haspopup·type이 붙어 접근성 검사에도 걸린다 */}
      {trigger && <DialogPrimitive.Trigger asChild>{triggerChild(trigger)}</DialogPrimitive.Trigger>}
      <ModalContent
        className={className}
        size={size}
        isDismissable={isDismissable}
        hideCloseButton={hideCloseButton}
        // 열리는 순간은 아직 포커스가 모달 밖(누른 버튼)에 있다
        onOpenAutoFocus={() => {
          returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }}
        onCloseAutoFocus={event => {
          const target = returnFocusRef.current;
          returnFocusRef.current = null;
          // 트리거가 있으면 Radix가 트리거로 돌려준다. 누른 요소가 사라졌으면(삭제 등) 기본 동작에 맡긴다
          if (!trigger && target?.isConnected) {
            event.preventDefault();
            target.focus();
          }
        }}
      >
        {children}
      </ModalContent>
    </DialogPrimitive.Root>
  );
}

/********************************************************************** */
/* Helper Components
/********************************************************************** */

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showOverlay?: boolean;
    size?: ModalSize;
    isDismissable?: boolean;
    hideCloseButton?: boolean;
  }
>(
  (
    { className, children, showOverlay = true, size = "md", isDismissable = false, hideCloseButton = false, ...props },
    ref,
  ) => (
    <DialogPrimitive.Portal>
      {showOverlay && (
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      )}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90%] max-h-[90%] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "rounded-lg",
          sizeClasses[size],
          className,
        )}
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
        {children}
        {!hideCloseButton && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-left mr-2",
      "text-lg font-semibold leading-tight tracking-tight",
      className,
    )}
    {...props}
  />
);
ModalHeader.displayName = "DialogHeader";

const ModalBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2", "text-base", className)} {...props} />
);
ModalBody.displayName = "ModalBody";

const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
ModalFooter.displayName = "ModalFooter";

const ModalClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ asChild = true, ...props }, ref) => <DialogPrimitive.Close ref={ref} asChild={asChild} {...props} />);
ModalClose.displayName = DialogPrimitive.Close.displayName;

export { Modal, ModalBody, ModalClose, ModalFooter, ModalHeader };
