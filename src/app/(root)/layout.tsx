import { type Metadata } from "next";

import { BaseRootLayout, GlobalFooter, GlobalHeader, GlobalSideNav } from "@components/layout";
import { LeftAsideLayout, RightAsideLayout } from "@components/layout/aside";

import { configureSEOMetadata } from "@configs/seo/config";

const PAGE_TITLE = "";

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = configureSEOMetadata({ title: PAGE_TITLE });

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <main className="flex justify-center w-full h-full">
      <LeftAsideLayout />
      <BaseRootLayout
        className="max-w-[500px]"
        header={<GlobalHeader />}
        sideNav={<GlobalSideNav />}
        content={children}
        footer={<GlobalFooter />}
      />
      <RightAsideLayout />
    </main>
  );
}
