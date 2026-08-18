import { use } from "react";

import MarketAnalysisContainer from "./_container";

type MarketAnalysisPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export default function MarketAnalysisPage({ params }: MarketAnalysisPageProps) {
  const { workspaceId } = use(params);

  return <MarketAnalysisContainer workspaceId={workspaceId} />;
}
