import { Suspense } from "react";

import { Center, HStack } from "@components/ui";

import { LAYOUT } from "@constants/layout";

import HeaderBackButton from "./_components/HeaderBackButton";

export default function GlobalHeader() {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-background" style={{ height: LAYOUT.HEADER.HEIGHT }}>
      <HStack className="flex-[0.3] justify-start items-center gap-1 w-fit">
        <Suspense fallback={null}>
          <HeaderBackButton />
        </Suspense>
        <div>Logo</div>
      </HStack>

      <Center className="flex-1 h-full items-center">
        <div>Title</div>
      </Center>

      <HStack className="flex-[0.3] justify-end items-center w-fit">
        <div>Menu</div>
      </HStack>
    </div>
  );
}
