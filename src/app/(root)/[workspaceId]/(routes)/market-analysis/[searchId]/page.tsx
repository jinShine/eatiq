import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import { STORE_SEARCH_TITLE } from "../_components/storeSearchView";
import StoreSearchReportContainer from "./_container";

type StoreSearchReportPageProps = {
  params: Promise<{ workspaceId: string; searchId: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: STORE_SEARCH_TITLE });

export default function StoreSearchReportPage({ params }: StoreSearchReportPageProps) {
  const { workspaceId, searchId } = use(params);

  return <StoreSearchReportContainer workspaceId={workspaceId} searchId={searchId} />;
}
