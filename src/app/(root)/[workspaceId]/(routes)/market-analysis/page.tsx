import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import MarketAnalysisContainer from "./_container";

type MarketAnalysisPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: "AI 상권분석" });

export default function MarketAnalysisPage({ params }: MarketAnalysisPageProps) {
  const { workspaceId } = use(params);

  return <MarketAnalysisContainer workspaceId={workspaceId} />;
}
