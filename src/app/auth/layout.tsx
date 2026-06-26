import { type Metadata } from "next";

import { BaseRootLayout } from "@components/layout";

import { configureSEOMetadata } from "@configs/seo/config";

const PAGE_TITLE = "";

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = configureSEOMetadata({ title: PAGE_TITLE });

export default function layout({ children }: LayoutProps) {
  return <BaseRootLayout content={children} />;
}
