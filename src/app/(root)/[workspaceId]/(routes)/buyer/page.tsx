import { use } from "react";

import BuyerContainer from "./_container";

type BuyerPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export default function BuyerPage({ params }: BuyerPageProps) {
  const { workspaceId } = use(params);

  return <BuyerContainer workspaceId={workspaceId} />;
}
