import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import ProgressDetailContainer from "./_container";

type ProgressDetailPageProps = {
  params: Promise<{ workspaceId: string; progressId: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: "진행 관리" });

export default function ProgressDetailPage({ params }: ProgressDetailPageProps) {
  const { workspaceId, progressId } = use(params);

  return <ProgressDetailContainer workspaceId={workspaceId} progressId={progressId} />;
}
