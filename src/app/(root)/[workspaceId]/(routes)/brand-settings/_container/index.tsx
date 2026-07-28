"use client";

import { SparklesIcon } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";

export default function BrandSettingsContainer() {
  return (
    <BaseContainerLayout
      header={
        <PageHeader
          title="회사 정보 설정"
          description="회사의 매력을 AI와 바이어가 더 잘 이해할 수 있도록 정보를 입력해주세요"
          action={
            <button className="border-border text-text-tertiary hover:bg-accent flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors">
              <SparklesIcon className="text-primary size-4" />
              AI에게 물어보세요
            </button>
          }
        />
      }
      content={
        <BaseContentLayout>
          <div className="p-8">
            <p className="text-text-tertiary text-sm">탭·폼은 다음 단계에서 채웁니다.</p>
          </div>
        </BaseContentLayout>
      }
    />
  );
}
