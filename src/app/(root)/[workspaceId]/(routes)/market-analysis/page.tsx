import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import { STORE_SEARCH_TITLE } from "./_components/storeSearchView";
import MarketAnalysisContainer from "./_container";

type MarketAnalysisPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: STORE_SEARCH_TITLE });

export default function MarketAnalysisPage({ params }: MarketAnalysisPageProps) {
  const { workspaceId } = use(params);

  return <MarketAnalysisContainer workspaceId={workspaceId} />;
}
