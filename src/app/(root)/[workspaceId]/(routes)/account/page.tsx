import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import AccountContainer from "./_container";

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: "내 정보 설정" });

export default function AccountPage({ params }: Props) {
  const { workspaceId } = use(params);

  return <AccountContainer workspaceId={workspaceId} />;
}
