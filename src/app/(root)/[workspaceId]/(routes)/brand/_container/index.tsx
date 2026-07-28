"use client";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";

export default function BrandContainer() {
  return (
    <BaseContainerLayout
      header={<PageHeader title="브랜드 탐색" />}
      content={
        <BaseContentLayout>
          <div className="p-8">
            <p className="text-text-tertiary text-sm">준비 중인 화면입니다.</p>
          </div>
        </BaseContentLayout>
      }
    />
  );
}
