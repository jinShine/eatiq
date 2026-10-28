"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

import { type CrmPartnerType } from "@services/api/crm/crm.query";
import { type CreateCrmRequest } from "@services/api/crm/crm.type";

import { cn } from "@utils/shadcn";

import FormSelect from "../../company-settings/_components/FormSelect";
import PartnerSearchField from "./PartnerSearchField";
import { type PartnerOption, type ProgressFilterOptions } from "./progressView";

/** 서버에 길이 제한이 없어 화면에서 막는다 — 목록 한 칸에 들어갈 만큼 */
const MAX_NAME_LENGTH = 100;

const targetSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "이름을 입력해주세요")
    .max(MAX_NAME_LENGTH, `${MAX_NAME_LENGTH}자 이내로 입력해주세요`),
  country: z.string(),
  city: z.string().trim().max(MAX_NAME_LENGTH, `${MAX_NAME_LENGTH}자 이내로 입력해주세요`),
  contract_type: z.string(),
  contact_name: z.string().trim().max(MAX_NAME_LENGTH, `${MAX_NAME_LENGTH}자 이내로 입력해주세요`),
  contact_email: z.union([z.literal(""), z.string().trim().email("이메일 형식이 올바르지 않습니다")]),
});

type TargetFormValues = z.infer<typeof targetSchema>;

const EMPTY_VALUES: TargetFormValues = {
  company_name: "",
  country: "",
  city: "",
  contract_type: "",
  contact_name: "",
  contact_email: "",
};

type TabKey = "search" | "manual";

/**
 * 빈 칸은 보내지 않는다 — 선택 항목은 생략하면 비어 있는 채로 저장된다.
 * 검색해서 고른 상대면 그 워크스페이스와 연결한다(target_workspace_uid) — 카테고리는 서버가 상대 정보로 채운다
 */
const toRequest = (
  values: TargetFormValues,
  partner: PartnerOption | null,
): Omit<CreateCrmRequest, "source_workspace_uid"> => ({
  target_workspace_uid: partner?.workspaceUid,
  company_name: values.company_name.trim(),
  country: values.country || undefined,
  city: values.city.trim() || undefined,
  contract_type: values.contract_type || undefined,
  contact_name: values.contact_name.trim() || undefined,
  contact_email: values.contact_email.trim() || undefined,
});

type AddProgressTargetModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** 「바이어」 또는 「브랜드」 — 브랜드 워크스페이스는 바이어를, 바이어 워크스페이스는 브랜드를 추가한다 */
  partnerLabel: string;
  partnerType: CrmPartnerType;
  /** 국가·계약 방식 선택지 — 목록 응답의 필터 선택지와 같은 값을 써야 필터에 걸린다 */
  options: ProgressFilterOptions;
  isPending: boolean;
  /** 서버가 거절한 사유. 모달을 닫지 않고 그대로 보여준다 */
  errorMessage?: string;
  /** 이미 관리 중인 상대의 워크스페이스 uid — 검색 결과에서 고를 수 없게 표시한다 */
  managedPartnerIds?: Set<number>;
  /** 탭·상대를 바꾸면 지난 거절 사유는 더 맞지 않는다 — 부모가 들고 있는 오류를 비운다 */
  onClearError: () => void;
  onSubmit: (body: Omit<CreateCrmRequest, "source_workspace_uid">) => void;
};

/**
 * 관리 대상 추가 (피그마 693:1867 · 693:1925).
 *
 * - 「검색해서 추가」(기본 탭): 플랫폼의 상대를 골라 그 워크스페이스와 연결한다.
 *   고른 상대의 담당자 이름·메일은 미리 채우고(고칠 수 있다), 국가도 함께 보낸다 — 서버가 연결해도 국가를 채우지 않는다(백엔드 요청).
 *   목록에 없으면 「직접 추가」로 넘어가며 친 이름을 그대로 채운다.
 * - 「직접 입력」: 플랫폼에 없는 상대. 도시는 시안에서 선택 박스지만 선택지가 없어 직접 입력으로 둔다.
 */
export default function AddProgressTargetModal({
  isOpen,
  onOpenChange,
  partnerLabel,
  partnerType,
  options,
  isPending,
  errorMessage,
  managedPartnerIds,
  onClearError,
  onSubmit,
}: AddProgressTargetModalProps) {
  // React Compiler 제외 — register 폼은 reset 뒤 입력칸이 갱신되지 않는다(BasicInfoSection 주석 참고)
  "use no memo";

  const [activeTab, setActiveTab] = useState<TabKey>("search");
  // 검색해서 고른 상대 — 「직접 입력」 탭에서는 늘 비어 있다
  const [partner, setPartner] = useState<PartnerOption | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TargetFormValues>({
    resolver: zodResolver(targetSchema),
    defaultValues: EMPTY_VALUES,
  });

  // 닫을 때마다 비운다. 다시 열었을 때 지난 입력이 남아 있으면 안 된다
  useEffect(() => {
    if (!isOpen) {
      reset(EMPTY_VALUES);
      setActiveTab("search");
      setPartner(null);
    }
  }, [isOpen, reset]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "search", label: "검색해서 추가" },
    { key: "manual", label: "직접 입력" },
  ];

  /** 상대를 고르면 이름·국가·담당자를 채운다. 고르기를 취소하면 그 값들을 비운다 */
  const handleSelectPartner = (option: PartnerOption | null) => {
    setPartner(option);
    clearErrors("company_name");
    onClearError();
    setValue("company_name", option?.name ?? "");
    setValue("country", option?.country ?? "");
    setValue("contact_name", option?.contactName ?? "");
    setValue("contact_email", option?.contactEmail ?? "");
  };

  /**
   * 탭을 바꾸면 고른 상대를 놓는다 — 직접 입력한 건이 다른 워크스페이스와 연결되면 안 된다.
   * 상대에게서 채운 이름·국가·담당자도 함께 비운다. 남겨 두면 그 회사 이름으로 연결 없는 건이 따로 만들어진다
   */
  const changeTab = (tab: TabKey) => {
    // 이미 보고 있는 탭을 다시 누르면 고른 상대를 놓지 않는다
    if (tab === activeTab) {
      return;
    }
    if (partner) {
      handleSelectPartner(null);
    }
    setActiveTab(tab);
    clearErrors();
    onClearError();
  };

  const handleManualAdd = (keyword: string) => {
    changeTab("manual");
    setValue("company_name", keyword);
  };

  const submit = handleSubmit(values => {
    // 검색 탭에서는 목록에서 골라야 한다 — 친 글자만으로는 어느 워크스페이스인지 모른다
    if (activeTab === "search" && !partner) {
      setError("company_name", { message: `목록에서 ${partnerLabel}를 골라주세요` });
      return;
    }
    onSubmit(toRequest(values, activeTab === "search" ? partner : null));
  });

  // 검색 탭은 고르기 전 이름이 비어 있어 스키마의 「이름을 입력해주세요」가 먼저 뜬다 — 검색 탭에 맞는 문구로 바꾼다
  const searchError =
    errors.company_name && !partner ? `목록에서 ${partnerLabel}를 골라주세요` : errors.company_name?.message;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-full sm:max-w-[480px]">
      <ModalHeader>관리 {partnerLabel} 추가</ModalHeader>

      <div role="tablist" aria-label="추가 방법" className="border-border -mx-6 flex gap-1 border-b px-6">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => changeTab(tab.key)}
              className={cn(
                "focus-visible:ring-ring -mb-px h-11 border-b-2 px-2 text-sm tracking-[-0.7px] transition-colors focus-visible:ring-2 focus-visible:outline-none",
                isActive
                  ? "text-text-primary border-text-primary font-bold"
                  : "text-text-secondary hover:text-text-primary border-transparent font-medium",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <form noValidate onSubmit={submit}>
        <ModalBody className="gap-6 space-y-0 py-2">
          {activeTab === "search" ? (
            // 시안(693:1867): 이름 검색 · 계약 방식 · 담당자 — 국가·도시는 고른 상대의 정보로 채운다
            <PartnerSearchField
              partnerType={partnerType}
              partnerLabel={partnerLabel}
              selected={partner}
              managedPartnerIds={managedPartnerIds}
              onSelect={handleSelectPartner}
              onManualAdd={handleManualAdd}
              errorText={searchError}
            />
          ) : (
            <>
              <Input
                id="company_name"
                size="md"
                label={`${partnerLabel} 이름`}
                required
                autoFocus
                autoComplete="off"
                placeholder={`${partnerLabel}명을 입력해주세요`}
                error={Boolean(errors.company_name)}
                errorText={errors.company_name?.message}
                {...register("company_name")}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-3">
                <FormSelect
                  control={control}
                  name="country"
                  label="국가"
                  labelClassName="text-sm"
                  placeholder="국가를 선택해주세요"
                  options={options.countries}
                />
                <Input
                  id="city"
                  size="md"
                  label="도시"
                  autoComplete="off"
                  placeholder="도시를 입력해주세요"
                  error={Boolean(errors.city)}
                  errorText={errors.city?.message}
                  {...register("city")}
                />
              </div>
            </>
          )}

          <FormSelect
            control={control}
            name="contract_type"
            label="계약 방식"
            labelClassName="text-sm"
            placeholder="계약 방식을 선택해주세요"
            options={options.contractTypes}
          />

          <Input
            id="contact_name"
            size="md"
            label="담당자 이름"
            autoComplete="off"
            placeholder="담당자 이름을 입력해주세요"
            error={Boolean(errors.contact_name)}
            errorText={errors.contact_name?.message}
            {...register("contact_name")}
          />

          <Input
            id="contact_email"
            size="md"
            type="email"
            label="담당자 메일"
            autoComplete="off"
            placeholder="담당자 메일을 입력해주세요"
            error={Boolean(errors.contact_email)}
            errorText={errors.contact_email?.message}
            {...register("contact_email")}
          />

          {errorMessage && (
            <p role="alert" className="text-error text-sm whitespace-pre-line">
              {errorMessage}
            </p>
          )}
        </ModalBody>

        <ModalFooter className="border-border -mx-6 mt-6 border-t px-6 pt-4">
          {/* 제목이 이미 「관리 바이어 추가」라 버튼은 동작만 적는다 */}
          <Button type="submit" isLoading={isPending}>
            추가
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
