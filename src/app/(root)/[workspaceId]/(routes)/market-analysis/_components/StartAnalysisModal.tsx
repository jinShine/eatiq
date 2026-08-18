"use client";

import { useState } from "react";

import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

import { cn } from "@utils/shadcn";

import FormSelect from "../../brand-settings/_components/FormSelect";
import { useAnalysisConditionForm } from "../_hooks/useAnalysisConditionForm";
import { type AnalysisConditionFormValues } from "./analysisConditionSchema";
import {
  ANALYSIS_CITY_OPTIONS,
  ANALYSIS_COUNTRY_OPTIONS,
  AREA_TYPE_OPTIONS,
  FLOOR_OPTIONS,
  IMPORTANCE_OPTIONS,
} from "./analysisOptions";

const TABS = [
  { key: "required", label: "필수 조건" },
  { key: "detail", label: "상세 조건" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/** 필수 조건 탭에 있는 필드 — 검증 실패 시 어느 탭으로 보낼지 판단한다 */
const REQUIRED_TAB_FIELDS = ["country", "city", "sizeMinPy", "sizeMaxPy", "rentMinKrw", "rentMaxKrw", "allowableFloor"];

type StartAnalysisModalProps = {
  workspaceId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: (values: AnalysisConditionFormValues) => void;
};

export default function StartAnalysisModal({
  workspaceId,
  isOpen,
  onOpenChange,
  onSubmitted,
}: StartAnalysisModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("required");

  const { form, changeCountry, applyBrandCriteria, submit, close } = useAnalysisConditionForm({
    workspaceId,
    onSubmitted: values => {
      onSubmitted(values);
      onOpenChange(false);
    },
    // 에러가 숨겨진 탭에 있으면 사용자는 왜 시작이 안 되는지 알 수 없다
    onInvalid: formErrors => {
      if (REQUIRED_TAB_FIELDS.some(field => field in formErrors)) {
        setActiveTab("required");
      }
    },
  });

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const country = watch("country");
  const cityOptions = ANALYSIS_CITY_OPTIONS[country] ?? [];

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
      setActiveTab("required");
    }
    onOpenChange(open);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} className="w-full sm:max-w-[560px]">
      <ModalHeader>AI 상권분석 시작</ModalHeader>

      <div className="bg-secondary-background/40 border-border -mx-6 flex gap-1 border-y px-6 py-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            aria-current={activeTab === tab.key ? "page" : undefined}
            className={cn(
              "focus-visible:ring-ring rounded-lg px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
              activeTab === tab.key
                ? "text-text-primary bg-white font-semibold shadow-xs"
                : "text-text-disabled hover:text-text-secondary",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 두 탭이 하나의 폼을 공유한다. 숨겨도 RHF이 값을 들고 있다 */}
      <ModalBody className="max-h-[60vh] gap-4 overflow-y-auto py-1">
        {activeTab === "required" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                control={control}
                name="country"
                label="분석 국가"
                options={ANALYSIS_COUNTRY_OPTIONS}
                onValueChange={changeCountry}
              />
              <FormSelect
                control={control}
                name="city"
                label="분석 도시"
                placeholder={country ? "선택해주세요" : "국가를 먼저 선택해주세요"}
                options={cityOptions}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                size="md"
                label="평형 (최소)"
                placeholder="예: 15"
                inputMode="numeric"
                error={Boolean(errors.sizeMinPy)}
                errorText={errors.sizeMinPy?.message}
                {...register("sizeMinPy")}
              />
              <Input
                size="md"
                label="평형 (최대)"
                placeholder="예: 30"
                inputMode="numeric"
                error={Boolean(errors.sizeMaxPy)}
                errorText={errors.sizeMaxPy?.message}
                {...register("sizeMaxPy")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                size="md"
                label="임대료 (최소, 월/KRW)"
                placeholder="예: 3000000"
                inputMode="numeric"
                error={Boolean(errors.rentMinKrw)}
                errorText={errors.rentMinKrw?.message}
                {...register("rentMinKrw")}
              />
              <Input
                size="md"
                label="임대료 (최대, 월/KRW)"
                placeholder="예: 8000000"
                inputMode="numeric"
                error={Boolean(errors.rentMaxKrw)}
                errorText={errors.rentMaxKrw?.message}
                {...register("rentMaxKrw")}
              />
            </div>

            <FormSelect control={control} name="allowableFloor" label="허용 층수" options={FLOOR_OPTIONS} />
          </>
        ) : (
          <>
            <div>
              <p className="text-text-secondary mb-1.5 text-sm font-semibold">선호 상권 (최대 3순위)</p>
              <div className="grid grid-cols-3 gap-2">
                <FormSelect
                  control={control}
                  name="preferredArea1st"
                  label=""
                  placeholder="1순위"
                  options={AREA_TYPE_OPTIONS}
                />
                <FormSelect
                  control={control}
                  name="preferredArea2nd"
                  label=""
                  placeholder="2순위"
                  options={AREA_TYPE_OPTIONS}
                />
                <FormSelect
                  control={control}
                  name="preferredArea3rd"
                  label=""
                  placeholder="3순위"
                  options={AREA_TYPE_OPTIONS}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                control={control}
                name="signageImportance"
                label="간판 노출 중요도"
                options={IMPORTANCE_OPTIONS}
              />
              <FormSelect
                control={control}
                name="storeSizeImportance"
                label="매장 노출 중요도"
                options={IMPORTANCE_OPTIONS}
              />
              <FormSelect
                control={control}
                name="parkingImportance"
                label="주차 필요 여부"
                options={IMPORTANCE_OPTIONS}
              />
              <FormSelect
                control={control}
                name="waitingSpaceImportance"
                label="대기공간 필요 여부"
                options={IMPORTANCE_OPTIONS}
              />
              <FormSelect
                control={control}
                name="lunchSalesImportance"
                label="점심 매출 중요도"
                options={IMPORTANCE_OPTIONS}
              />
              <FormSelect
                control={control}
                name="dinnerSalesImportance"
                label="저녁 매출 중요도"
                options={IMPORTANCE_OPTIONS}
              />
              <FormSelect
                control={control}
                name="weekdaySalesImportance"
                label="주중 매출 중요도"
                options={IMPORTANCE_OPTIONS}
              />
              <FormSelect
                control={control}
                name="weekendSalesImportance"
                label="주말 매출 중요도"
                options={IMPORTANCE_OPTIONS}
              />
            </div>
          </>
        )}
      </ModalBody>

      {/* 기본 ModalFooter는 우측 정렬이라 불러오기 버튼을 왼쪽에 두려면 justify-between으로 덮는다 */}
      <ModalFooter className="border-border -mx-6 -mb-6 items-center border-t px-6 py-4 sm:justify-between sm:space-x-0">
        <Button type="button" variant="outline" size="sm" onClick={applyBrandCriteria}>
          브랜드 정보에서 조건 불러오기
        </Button>
        <Button type="button" size="sm" onClick={submit}>
          분석 시작
        </Button>
      </ModalFooter>
    </Modal>
  );
}
