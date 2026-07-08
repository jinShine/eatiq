"use client";

import React from "react";

import { VStack } from "@components/ui/Container";

import { useUserSettingsStore } from "@stores/useUserSettingsStore";

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
  const sidebarCollapsed = useUserSettingsStore(state => state.sidebarCollapsed);
  const sidebarWidth = sidebarCollapsed ? 64 : LAYOUT.NAVIGATION.SIDEBAR.WIDTH; // 64 ↔ 260

  return (
    <>
      {/* sideNav */}
      {sideNav && (
        <aside
          className={cn(
            "fixed top-0 left-0 bottom-0 z-40 border-r overflow-hidden hidden md:block transition-[width] duration-300 ease-in-out",
          )}
          style={{ width: sidebarWidth }} // ← 고정 260 대신 동적
        >
          {sideNav}
        </aside>
      )}

      <VStack
        className={cn(
          `justify-between items-start min-h-svh gap-0 transition-[margin] duration-300 ease-in-out`,
          sideNav && (sidebarCollapsed ? "w-full md:w-auto ml-0 md:ml-[64px]" : "w-full md:w-auto ml-0 md:ml-[260px]"),
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
