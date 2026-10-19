import { use } from "react";

import DashboardContainer from "./_container";

type DashboardPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export default function DashboardPage({ params }: DashboardPageProps) {
  const { workspaceId } = use(params);

  return <DashboardContainer workspaceId={workspaceId} />;
}
