import { use } from "react";

import { type SettingsTabKey } from "./_components/SettingsTabNav";
import BrandSettingsContainer from "./_container";

type BrandSettingsPageProps = {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default function BrandSettingsPage({ params, searchParams }: BrandSettingsPageProps) {
  const { workspaceId } = use(params);
  const { tab } = use(searchParams);

  return <BrandSettingsContainer workspaceId={workspaceId} activeTab={(tab ?? "basic") as SettingsTabKey} />;
}
