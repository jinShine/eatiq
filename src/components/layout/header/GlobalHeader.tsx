import { BellIcon } from "lucide-react";

import { NotiBadge } from "@components/ui";

import { LAYOUT } from "@constants/layout";

export default function GlobalHeader() {
  return (
    <div
      className="border-border bg-background flex items-center justify-between border-b px-6 py-3"
      style={{ height: LAYOUT.HEADER.HEIGHT }}
    >
      <h1 className="text-text-primary text-lg font-bold tracking-tight">대시보드</h1>

      <div className="flex items-center gap-4">
        <NotiBadge count={3}>
          <BellIcon className="text-text-secondary size-5" />
        </NotiBadge>
        <div className="bg-primary-light text-primary flex size-8 items-center justify-center rounded-full text-xs font-bold">
          몽
        </div>
      </div>
    </div>
  );
}
