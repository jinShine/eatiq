import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import AccountContainer from "./_container";

export const metadata: Metadata = configureSEOMetadata({ title: "내 정보 설정" });

export default function AccountPage() {
  return <AccountContainer />;
}
