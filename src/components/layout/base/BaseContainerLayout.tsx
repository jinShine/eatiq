import { VStack } from "@components/ui/Container";

import { cn } from "@utils/shadcn";

type BaseContainerLayoutProps = {
  header?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
  contentClassName?: string;
};

export default function BaseContainerLayout({
  header,
  content,
  footer,

  className,
  style,
  contentClassName,
}: BaseContainerLayoutProps) {
  return (
    <VStack className={cn("gap-0 flex-1", className)} style={style}>
      {header}
      <VStack className={cn("flex-1", contentClassName)}>{content}</VStack>
      {footer}
    </VStack>
  );
}
