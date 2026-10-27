import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import BuyerContainer from "./_container";

type BuyerPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: "바이어 탐색" });

export default function BuyerPage({ params }: BuyerPageProps) {
  const { workspaceId } = use(params);

  return <BuyerContainer workspaceId={workspaceId} />;
}
