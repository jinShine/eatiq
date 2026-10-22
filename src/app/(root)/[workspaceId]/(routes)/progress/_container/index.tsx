"use client";

import { useState } from "react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import BaseContentLayout from "@components/layout/base/BaseContentLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Toast } from "@components/ui";

import { type CrmListFilters, useCreateCrm, useDeleteCrm } from "@services/api/crm/crm.query";
import { type CreateCrmRequest } from "@services/api/crm/crm.type";
import { useCurrentWorkspace } from "@services/api/workspace/workspace.query";

import { useDebounce } from "@hooks/commons";

import AddProgressTargetModal from "../_components/AddProgressTargetModal";
import ProgressDeleteModal from "../_components/ProgressDeleteModal";
import ProgressEmptyState from "../_components/ProgressEmptyState";
import ProgressFilterBar, { EMPTY_FILTERS, type ProgressFilters } from "../_components/ProgressFilterBar";
import ProgressTable from "../_components/ProgressTable";
import ProgressTableSkeleton from "../_components/ProgressTableSkeleton";
import { type ProgressRow } from "../_components/progressView";
import { useProgressList } from "../_hooks/useProgressList";

/** 검색어는 입력이 멈춘 뒤에 보낸다 — 글자마다 요청하지 않게 */
const KEYWORD_DEBOUNCE_MS = 300;

/** 필터 → 목록 API 파라미터. 「전체」(빈 값)와 공백 검색어는 보내지 않는다 */
const toListFilters = (filters: ProgressFilters, keyword: string): CrmListFilters => ({
  keyword: keyword.trim() || undefined,
  country: filters.country || undefined,
  category: filters.category || undefined,
  contract_type: filters.contractType || undefined,
});

type ProgressContainerProps = {
  workspaceId: string;
};

export default function ProgressContainer({ workspaceId }: ProgressContainerProps) {
  // 브랜드 워크스페이스는 바이어를, 바이어 워크스페이스는 브랜드를 관리한다
  const workspace = useCurrentWorkspace(workspaceId);
  const partnerLabel = workspace?.type === "buyer" ? "브랜드" : "바이어";

  const [filters, setFilters] = useState<ProgressFilters>(EMPTY_FILTERS);
  const keyword = useDebounce(filters.keyword, KEYWORD_DEBOUNCE_MS);
  const listFilters = toListFilters(filters, keyword);
  const isFiltered = Object.values(listFilters).some(Boolean);
  const { rows, filterOptions, isLoading, isRefetching, error, hasMore, isLoadingMore, loadMore, retry } =
    useProgressList(workspaceId, listFilters);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const {
    mutate: createCrm,
    isPending: isCreating,
    error: createError,
    reset: clearCreateError,
  } = useCreateCrm(workspaceId);

  const handleAddOpenChange = (open: boolean) => {
    if (isCreating) {
      return;
    }
    setIsAddOpen(open);
    clearCreateError();
  };

  const handleCreate = (body: Omit<CreateCrmRequest, "source_workspace_uid">) => {
    createCrm(body, {
      onSuccess: () => {
        // 이름이 영문인 경우가 많아 조사를 맞출 수 없다 — 이름은 설명 줄로 뺀다
        Toast.success("진행 관리에 추가했어요.", { description: body.company_name });
        setIsAddOpen(false);
        // 새 행이 필터에 가려 안 보이는 일이 없게 필터를 푼다
        setFilters(EMPTY_FILTERS);
      },
    });
  };

  const [deleteTarget, setDeleteTarget] = useState<ProgressRow | null>(null);
  const { mutate: deleteCrm, isPending: isDeleting } = useDeleteCrm(workspaceId);

  const handleReset = () => setFilters(EMPTY_FILTERS);

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }
    deleteCrm(deleteTarget.id, {
      onSuccess: () => {
        Toast.success("진행 관리에서 삭제했어요.", { description: deleteTarget.partnerName });
        setDeleteTarget(null);
      },
      onError: deleteError => Toast.error(deleteError.message),
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return <ProgressTableSkeleton partnerLabel={partnerLabel} />;
    }
    if (error) {
      return (
        <ProgressEmptyState variant="error" partnerLabel={partnerLabel} errorMessage={error.message} onRetry={retry} />
      );
    }
    if (rows.length === 0) {
      return isFiltered ? (
        <ProgressEmptyState variant="no-result" partnerLabel={partnerLabel} onResetFilters={handleReset} />
      ) : (
        <ProgressEmptyState variant="no-data" partnerLabel={partnerLabel} onAdd={() => setIsAddOpen(true)} />
      );
    }
    return (
      <ProgressTable
        rows={rows}
        partnerLabel={partnerLabel}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        isRefetching={isRefetching}
        onLoadMore={loadMore}
        onDelete={setDeleteTarget}
      />
    );
  };

  return (
    <BaseContainerLayout
      header={<PageHeader title="진행 관리" description="파트너와의 소통 기록을 관리합니다." />}
      content={
        <BaseContentLayout>
          {/* 필터가 바뀌면 목록 queryKey가 바뀌어 첫 페이지부터 다시 받는다 */}
          <ProgressFilterBar
            filters={filters}
            options={filterOptions}
            partnerLabel={partnerLabel}
            onChange={setFilters}
            onReset={handleReset}
            onAdd={() => setIsAddOpen(true)}
          />

          <div className="px-6 py-6">{renderContent()}</div>

          <AddProgressTargetModal
            isOpen={isAddOpen}
            onOpenChange={handleAddOpenChange}
            partnerLabel={partnerLabel}
            partnerType={workspace?.type === "buyer" ? "brand" : "buyer"}
            options={filterOptions}
            isPending={isCreating}
            errorMessage={createError?.message}
            onSubmit={handleCreate}
          />

          <ProgressDeleteModal
            partnerName={deleteTarget?.partnerName ?? null}
            isPending={isDeleting}
            onOpenChange={open => !open && !isDeleting && setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        </BaseContentLayout>
      }
    />
  );
}
