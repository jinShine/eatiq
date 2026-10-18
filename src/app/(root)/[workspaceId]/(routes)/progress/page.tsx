import { use } from "react";

import ProgressContainer from "./_container";

type ProgressPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export default function ProgressPage({ params }: ProgressPageProps) {
  const { workspaceId } = use(params);

  return <ProgressContainer workspaceId={workspaceId} />;
}
