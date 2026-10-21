"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { isAxiosError } from "axios";
import { TriangleAlert } from "lucide-react";

import BaseContainerLayout from "@components/layout/base/BaseContainerLayout";
import PageHeader from "@components/layout/header/PageHeader";
import { Button, Skeleton, Toast } from "@components/ui";

import {
  useCreateCrmAction,
  useDeleteCrm,
  useDeleteCrmAction,
  useUpdateCrmAction,
  useUpdateCrmNextActionDone,
  useUpdateCrmStage,
} from "@services/api/crm/crm.query";

import ProgressDeleteModal from "../../_components/ProgressDeleteModal";
import { type StageCode } from "../../_components/progressOptions";
import BuyerInfoCard from "../_components/BuyerInfoCard";
import NextActionSummaryCard from "../_components/NextActionSummaryCard";
import ProgressDetailHeader from "../_components/ProgressDetailHeader";
import ProgressRecordSheet from "../_components/ProgressRecordSheet";
import ProgressTimeline from "../_components/ProgressTimeline";
import RecordDeleteModal from "../_components/RecordDeleteModal";
import StageCard from "../_components/StageCard";
import { type NextActionSummary, type ProgressRecord } from "../_components/progressDetailView";
import { type ProgressRecordFormValues, toCreateRequest, toUpdateRequest } from "../_components/progressRecordSchema";
import { useProgressDetail } from "../_hooks/useProgressDetail";

/** 국가·도시 중 있는 것만 「일본 · 도쿄」로 잇는다 */
const toLocation = (country: string | null, city: string | null) => [country, city].filter(Boolean).join(" · ");

function DetailSkeleton() {
  return (
    <div role="status" aria-label="진행 관리 정보를 불러오는 중" className="flex min-h-0 flex-1 flex-col">
      <div className="border-border flex h-16 items-center gap-3 border-b px-6">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="h-6 w-56" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="border-border flex w-full shrink-0 flex-col gap-4 border-b p-6 lg:w-[354px] lg:border-r lg:border-b-0">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="mt-4 h-5 w-24" />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

type ProgressDetailContainerProps = {
  workspaceId: string;
  progressId: string;
};

export default function ProgressDetailContainer({ workspaceId, progressId }: ProgressDetailContainerProps) {
  const router = useRouter();
  const listHref = `/${workspaceId}/progress`;

  const { detail, isLoading, error, retry } = useProgressDetail(progressId);
  const isNotFound = isAxiosError(error) && error.response?.status === 404;

  // 지워졌거나 없는 항목이면 알리고 목록으로 보낸다 — 스펙의 404 처리 안내.
  // 서버 문구(「해당 CRM 레코드를…」)는 개발 용어라 화면 문구로 바꾼다
  useEffect(() => {
    if (isNotFound) {
      Toast.error("이미 삭제된 진행 건이에요.");
      router.replace(listHref);
    }
  }, [isNotFound, router, listHref]);

  const { mutate: updateStage } = useUpdateCrmStage(workspaceId, progressId);
  const { mutate: updateActionDone } = useUpdateCrmNextActionDone(workspaceId, progressId);

  const handleStageChange = (stage: StageCode) =>
    updateStage(stage, { onError: stageError => Toast.error(stageError.message) });

  const handleToggleAction = (action: NextActionSummary, isDone: boolean) =>
    updateActionDone(
      { actionId: action.actionId, idx: action.idx, isDone },
      { onError: doneError => Toast.error(doneError.message) },
    );

  // 진행 기록 삭제
  const [recordToDelete, setRecordToDelete] = useState<ProgressRecord | null>(null);
  const { mutate: deleteRecord, isPending: isDeletingRecord } = useDeleteCrmAction(workspaceId, progressId);

  const handleDeleteRecord = () => {
    if (!recordToDelete) {
      return;
    }
    deleteRecord(recordToDelete.id, {
      onSuccess: () => {
        Toast.success("진행 기록을 삭제했어요.");
        setRecordToDelete(null);
      },
      onError: deleteError => Toast.error(deleteError.message),
    });
  };

  // 관리 대상 삭제 — 끝나면 목록으로
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteCrm, isPending: isDeletingCrm } = useDeleteCrm(workspaceId);

  const handleDeleteCrm = () => {
    if (!detail) {
      return;
    }
    deleteCrm(detail.id, {
      onSuccess: () => {
        Toast.success("진행 관리에서 삭제했어요.", { description: detail.partnerName });
        router.replace(listHref);
      },
      onError: deleteError => Toast.error(deleteError.message),
    });
  };

  // 진행 기록 드로어 — 여는 버튼은 헤더(추가)와 카드 메뉴(수정)에 있어 공통 부모가 상태를 쥔다
  const [isRecordSheetOpen, setIsRecordSheetOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<ProgressRecord | null>(null);
  const createRecord = useCreateCrmAction(workspaceId, progressId);
  const updateRecord = useUpdateCrmAction(workspaceId, progressId);
  const recordMutation = recordToEdit ? updateRecord : createRecord;

  const openRecordSheet = (record: ProgressRecord | null) => {
    createRecord.reset();
    updateRecord.reset();
    setRecordToEdit(record);
    setIsRecordSheetOpen(true);
  };

  const handleSaveRecord = (values: ProgressRecordFormValues) => {
    const onSuccess = () => {
      Toast.success(recordToEdit ? "진행 기록을 수정했어요." : "진행 기록을 저장했어요.");
      setIsRecordSheetOpen(false);
    };
    if (recordToEdit) {
      updateRecord.mutate({ actionId: recordToEdit.id, body: toUpdateRequest(values) }, { onSuccess });
    } else {
      createRecord.mutate(toCreateRequest(values), { onSuccess });
    }
  };

  const renderContent = () => {
    if (isLoading || isNotFound) {
      return <DetailSkeleton />;
    }
    if (error || !detail) {
      return (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-secondary-background text-text-disabled flex size-12 items-center justify-center rounded-2xl">
              <TriangleAlert className="size-5" strokeWidth={1.5} />
            </div>
            <p className="text-text-primary mt-5 text-sm font-semibold">진행 관리 정보를 불러오지 못했어요</p>
            <p className="text-text-tertiary mt-1.5 text-xs">{error?.message}</p>
            <Button variant="outline" size="sm" className="mt-6" onClick={retry}>
              다시 시도
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <ProgressDetailHeader
          partnerName={detail.partnerName}
          location={toLocation(detail.country, detail.city)}
          backHref={listHref}
          onAddRecord={() => openRecordSheet(null)}
          onDelete={() => setIsDeleteOpen(true)}
        />

        {/* 좌: 고정 폭 요약 패널 · 우: 스크롤되는 타임라인 */}
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <aside className="border-border flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-b p-6 lg:w-[354px] lg:border-r lg:border-b-0">
            <StageCard stage={detail.stage} onChange={handleStageChange} />

            <div className="h-px bg-[#f3f4f6]" />

            <BuyerInfoCard
              rows={[
                { label: "국가", value: detail.country },
                { label: "도시", value: detail.city },
                { label: "계약 방식", value: detail.contractType },
                { label: "담당자 이름", value: detail.contactName },
                { label: "담당자 메일", value: detail.contactEmail },
              ]}
            />

            <div className="h-px bg-[#f3f4f6]" />

            <NextActionSummaryCard actions={detail.nextActions} onToggle={handleToggleAction} />
          </aside>

          <div className="min-w-0 flex-1 overflow-y-auto p-6">
            <ProgressTimeline records={detail.records} onEdit={openRecordSheet} onDelete={setRecordToDelete} />
          </div>
        </div>

        <ProgressRecordSheet
          isOpen={isRecordSheetOpen}
          record={recordToEdit}
          isPending={recordMutation.isPending}
          errorMessage={recordMutation.error?.message}
          onOpenChange={setIsRecordSheetOpen}
          onSubmit={handleSaveRecord}
        />

        <RecordDeleteModal
          title={recordToDelete?.title ?? null}
          isPending={isDeletingRecord}
          onOpenChange={open => !open && !isDeletingRecord && setRecordToDelete(null)}
          onConfirm={handleDeleteRecord}
        />

        <ProgressDeleteModal
          partnerName={isDeleteOpen ? detail.partnerName : null}
          isPending={isDeletingCrm}
          onOpenChange={open => !isDeletingCrm && setIsDeleteOpen(open)}
          onConfirm={handleDeleteCrm}
        />
      </div>
    );
  };

  return (
    <BaseContainerLayout
      header={<PageHeader title="진행 관리" description="파트너와의 소통 기록을 관리합니다." />}
      content={renderContent()}
    />
  );
}
