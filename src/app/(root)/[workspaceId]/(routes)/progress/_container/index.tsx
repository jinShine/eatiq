"use client";

import { useEffect, useMemo, useState } from "react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";

import ProgressEmptyState from "../_components/ProgressEmptyState";
import ProgressFilterBar, { EMPTY_FILTERS, type ProgressFilters } from "../_components/ProgressFilterBar";
import ProgressTable from "../_components/ProgressTable";
import ProgressTableSkeleton from "../_components/ProgressTableSkeleton";
import { type ProgressRow } from "../_components/progressColumns";
import { PROGRESS_MOCK } from "../_components/progressMock";
import { ALL_VALUE } from "../_components/progressOptions";

// TODO(API): 목록 API가 준비되면 서버 필터로 옮긴다. 지금은 목업을 클라이언트에서 거른다.
const filterRows = (rows: ProgressRow[], filters: ProgressFilters) => {
  const keyword = filters.keyword.trim().toLowerCase();

  return rows.filter(row => {
    if (keyword && !`${row.buyerName} ${row.city}`.toLowerCase().includes(keyword)) {
      return false;
    }
    if (filters.country !== ALL_VALUE && row.countryCode !== filters.country) {
      return false;
    }
    if (filters.category !== ALL_VALUE && row.category !== filters.category) {
      return false;
    }
    if (filters.contractType !== ALL_VALUE && row.contractType !== filters.contractType) {
      return false;
    }
    return true;
  });
};

export default function ProgressContainer() {
  const [filters, setFilters] = useState<ProgressFilters>(EMPTY_FILTERS);

  // TODO(API): useQuery의 isLoading으로 교체한다. 목업 단계에서 로딩 UI를 확인하기 위한 임시 상태다.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const rows = useMemo(() => filterRows(PROGRESS_MOCK, filters), [filters]);

  const hasNoData = !isLoading && PROGRESS_MOCK.length === 0;
  const hasNoResult = !isLoading && PROGRESS_MOCK.length > 0 && rows.length === 0;

  const handleReset = () => setFilters(EMPTY_FILTERS);

  return (
    <BaseContainerLayout
      header={<PageHeader title="진행 관리" description="파트너와의 소통 기록을 관리합니다." />}
      content={
        <BaseContentLayout>
          <ProgressFilterBar filters={filters} onChange={setFilters} onReset={handleReset} />

          <div className="px-6 py-6">
            {isLoading && <ProgressTableSkeleton />}
            {hasNoData && <ProgressEmptyState variant="no-data" />}
            {hasNoResult && <ProgressEmptyState variant="no-result" onResetFilters={handleReset} />}
            {!isLoading && rows.length > 0 && <ProgressTable rows={rows} />}
          </div>
        </BaseContentLayout>
      }
    />
  );
}
