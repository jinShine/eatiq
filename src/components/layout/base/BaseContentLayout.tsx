import { VStack } from "@components/ui/Container";

import { LAYOUT } from "@constants/layout";

export default function BaseContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      className="mx-auto flex-1"
      style={{
        maxWidth: LAYOUT.CONTAINER.CONTENT_MAX_WIDTH,
      }}
    >
      {children}
    </VStack>
  );
}
