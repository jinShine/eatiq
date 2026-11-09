"use client";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";

import ComingSoonTab from "../_components/ComingSoonTab";
import DocumentsTabNav from "../_components/DocumentsTabNav";
import { DOCUMENTS_TABS, type DocumentsTabKey } from "../_components/documentsTabs";

type BrandDocumentsContainerProps = {
  workspaceId: string;
  activeTab: DocumentsTabKey;
};

/** 회사 문서 작성 — 탭 4개(피그마 2262:9924). 탭 내용은 하나씩 채운다 */
export default function BrandDocumentsContainer({ workspaceId, activeTab }: BrandDocumentsContainerProps) {
  const activeLabel = DOCUMENTS_TABS.find(tab => tab.key === activeTab)?.label ?? "";

  return (
    <BaseContainerLayout
      header={<PageHeader title="회사 문서 작성" description="소개서, 영상 등 회사의 소개 자료를 만듭니다." />}
      content={
        <BaseContentLayout>
          <DocumentsTabNav workspaceId={workspaceId} activeTab={activeTab} />
          <ComingSoonTab label={activeLabel} />
        </BaseContentLayout>
      }
    />
  );
}
