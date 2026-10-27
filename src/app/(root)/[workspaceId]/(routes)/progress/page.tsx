import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import ProgressContainer from "./_container";

type ProgressPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: "진행 관리" });

export default function ProgressPage({ params }: ProgressPageProps) {
  const { workspaceId } = use(params);

  return <ProgressContainer workspaceId={workspaceId} />;
}
