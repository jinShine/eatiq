import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

const PAGE_TITLE = "로그인";

type LayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = configureSEOMetadata({ title: PAGE_TITLE });

export default function layout({ children }: LayoutProps) {
  return <>{children}</>;
}
