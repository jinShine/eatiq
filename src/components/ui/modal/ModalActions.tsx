import { HStack } from "../Container";
import { Button } from "../button";

type ModalActionsProps = {
  cancelLabel?: string;
  cancelClassName?: string;
  onCancel?: () => void;

  actionType?: "button" | "submit";
  actionLabel?: string;
  actionVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  actionClassName?: string;
  onAction?: () => void;
} & {
  isLoading?: boolean;
  disabled?: boolean;
};

export default function ModalActions({
  isLoading = false,
  disabled = false,
  cancelLabel = "취소",
  cancelClassName,
  onCancel,
  actionType = "submit",
  actionLabel = "저장",
  actionVariant = "default",
  actionClassName,
  onAction,
}: ModalActionsProps) {
  return (
    <HStack className="justify-end items-center gap-2">
      <Button
        size={"sm"}
        variant={"ghost"}
        disabled={isLoading}
        className={cancelClassName}
        onClick={e => {
          e.stopPropagation();
          onCancel?.();
        }}
      >
        {cancelLabel}
      </Button>
      <Button
        type={actionType}
        size={"sm"}
        variant={actionVariant}
        isLoading={isLoading}
        disabled={disabled || isLoading}
        onClick={onAction}
        className={actionClassName}
      >
        {actionLabel}
      </Button>
    </HStack>
  );
}
