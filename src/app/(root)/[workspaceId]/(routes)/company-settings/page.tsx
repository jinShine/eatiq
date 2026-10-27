import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import { type SettingsTabKey } from "./_components/SettingsTabNav";
import CompanySettingsContainer from "./_container";

type CompanySettingsPageProps = {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: "회사 정보 설정" });

export default function CompanySettingsPage({ params, searchParams }: CompanySettingsPageProps) {
  const { workspaceId } = use(params);
  const { tab } = use(searchParams);

  // tab은 브랜드 화면만 쓴다(바이어는 탭 없는 한 페이지)
  return <CompanySettingsContainer workspaceId={workspaceId} activeTab={(tab ?? "basic") as SettingsTabKey} />;
}
