import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import AuthGuard from "./_components/AuthGuard";

const PAGE_TITLE = "";

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = configureSEOMetadata({ title: PAGE_TITLE });

export default function RootLayout({ children }: RootLayoutProps) {
  return <AuthGuard>{children}</AuthGuard>;
}
