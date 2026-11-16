"use client";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";

import DocumentsTabNav from "../_components/DocumentsTabNav";
import { type DocumentsTabKey } from "../_components/documentsTabs";
import DraftTab from "../_components/draft/DraftTab";
import IntroTab from "../_components/intro/IntroTab";
import VideoTab from "../_components/video/VideoTab";

type BrandDocumentsContainerProps = {
  workspaceId: string;
  activeTab: DocumentsTabKey;
};

/** 회사 문서 작성 — 탭 4개(피그마 2262:9924) */
export default function BrandDocumentsContainer({ workspaceId, activeTab }: BrandDocumentsContainerProps) {
  return (
    <BaseContainerLayout
      header={<PageHeader title="회사 문서 작성" description="소개서, 영상 등 회사의 소개 자료를 만듭니다." />}
      content={
        <BaseContentLayout>
          <DocumentsTabNav workspaceId={workspaceId} activeTab={activeTab} />
          {activeTab === "intro" ? (
            <IntroTab workspaceId={workspaceId} />
          ) : activeTab === "video" ? (
            <VideoTab workspaceId={workspaceId} />
          ) : (
            // key — 탭을 바꾸면 고른 진행 건을 초기화한다
            <DraftTab key={activeTab} workspaceId={workspaceId} docType={activeTab} />
          )}
        </BaseContentLayout>
      }
    />
  );
}
