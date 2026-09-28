import { use } from "react";

import WorkspacesSettingsContainer from "./_container";

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export default function WorkspacesSettingsPage({ params }: Props) {
  const { workspaceId } = use(params);

  return <WorkspacesSettingsContainer workspaceId={workspaceId} />;
}
