import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import DashboardContainer from "./_container";

type DashboardPageProps = {
  params: Promise<{ workspaceId: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: "대시보드" });

export default function DashboardPage({ params }: DashboardPageProps) {
  const { workspaceId } = use(params);

  return <DashboardContainer workspaceId={workspaceId} />;
}
