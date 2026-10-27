import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import WorkspacesSettingsContainer from "./_container";

type Props = {
  params: Promise<{ workspaceId: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: "워크스페이스 정보 설정" });

export default function WorkspacesSettingsPage({ params }: Props) {
  const { workspaceId } = use(params);

  return <WorkspacesSettingsContainer workspaceId={workspaceId} />;
}
