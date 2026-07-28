"use client";

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
