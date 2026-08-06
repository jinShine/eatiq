import { use } from "react";

import ProgressDetailContainer from "./_container";

type ProgressDetailPageProps = {
  params: Promise<{ workspaceId: string; progressId: string }>;
};

export default function ProgressDetailPage({ params }: ProgressDetailPageProps) {
  const { workspaceId, progressId } = use(params);

  return <ProgressDetailContainer workspaceId={workspaceId} progressId={progressId} />;
}
