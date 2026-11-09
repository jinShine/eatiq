import { use } from "react";

import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import { toDocumentsTabKey } from "./_components/documentsTabs";
import BrandDocumentsContainer from "./_container";

type BrandDocumentsPageProps = {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export const metadata: Metadata = configureSEOMetadata({ title: "회사 문서 작성" });

export default function BrandDocumentsPage({ params, searchParams }: BrandDocumentsPageProps) {
  const { workspaceId } = use(params);
  const { tab } = use(searchParams);

  return <BrandDocumentsContainer workspaceId={workspaceId} activeTab={toDocumentsTabKey(tab)} />;
}
