"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, HStack } from "@components/ui";

import { LAYOUT } from "@constants/layout";

import { cn } from "@utils/shadcn";

import { getNavMenuList } from "./constants/nav-menu-list";

export default function GlobalHorizontalNav() {
  const pathName = usePathname();

  return (
    <HStack className="w-full px-[24px] bg-white" style={{ height: LAYOUT.NAVIGATION.HORIZONTAL.HEIGHT }}>
      <nav className="flex w-full h-full">
        <ul className="flex gap-[12px]">
          {getNavMenuList(pathName).map(menu => (
            <li key={menu.id}>
              <Link href={menu.href}>
                <Button
                  variant={"ghost"}
                  className={cn(
                    "bg-transparent rounded-none border-b-2 border-transparent h-full transition-colors duration-300 hover:border-primary hover:bg-transparent hover:font-semibold",
                    menu.isActive && "border-primary font-semibold",
                  )}
                >
                  {menu.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </HStack>
  );
}
