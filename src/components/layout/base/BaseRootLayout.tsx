import React from "react";

import { VStack } from "@components/ui/Container";

import { LAYOUT } from "@constants/layout";

import { cn } from "@utils/shadcn";

type BaseRootLayoutProps = {
  header?: React.ReactNode;
  sideNav?: React.ReactNode;
  horizonNav?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
  contentClassName?: string;
};

export default function BaseRootLayout({
  header,
  sideNav,
  horizonNav,
  content,
  footer,
  className,
  style,
  contentClassName,
}: BaseRootLayoutProps) {
  return (
    <>
      {/* sideNav */}
      {sideNav && (
        <aside
          className={cn(`fixed top-0 left-0 bottom-0 z-40 border-r overflow-auto hidden md:block`)}
          style={{ width: LAYOUT.NAVIGATION.SIDEBAR.WIDTH }}
        >
          {sideNav}
        </aside>
      )}

      <VStack
        className={cn(
          `justify-between items-start min-h-svh gap-0`,
          sideNav && `w-full md:w-auto ml-0 md:ml-[260px]`,
          className,
        )}
        style={style}
      >
        {/* header */}
        {header && <header className={cn("sticky top-0 z-40 w-full", horizonNav && "border-none")}>{header}</header>}

        {/* horizonNav */}
        {horizonNav && (
          <div className="w-full sticky z-40 flex items-center" style={{ top: header ? LAYOUT.HEADER.HEIGHT : 0 }}>
            {horizonNav}
          </div>
        )}

        {/* content */}
        <main className={cn(`flex flex-col flex-1 w-full h-full`, contentClassName)}>{content}</main>

        {/* footer */}
        {footer && <footer className="w-full">{footer}</footer>}
      </VStack>
    </>
  );
}
