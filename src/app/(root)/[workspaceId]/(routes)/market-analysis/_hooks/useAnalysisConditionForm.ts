import { type FieldErrors, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Toast } from "@components/ui";

import { useBrandSettings } from "@services/api/brand/brand.query";

import {
  type AnalysisConditionFormValues,
  EMPTY_CONDITION,
  analysisConditionSchema,
} from "../_components/analysisConditionSchema";

const toText = (v?: number | null) => (v === null || v === undefined ? "" : String(v));

type UseAnalysisConditionFormParams = {
  workspaceId: string;
  onSubmitted: (values: AnalysisConditionFormValues) => void;
  /** 검증 실패 시 — 에러가 숨겨진 탭에 있으면 그 탭으로 보내기 위해 필요하다 */
  onInvalid?: (errors: FieldErrors<AnalysisConditionFormValues>) => void;
};

export function useAnalysisConditionForm({ workspaceId, onSubmitted, onInvalid }: UseAnalysisConditionFormParams) {
  const { data: settings } = useBrandSettings(workspaceId);

  const form = useForm<AnalysisConditionFormValues>({
    resolver: zodResolver(analysisConditionSchema),
    defaultValues: EMPTY_CONDITION,
  });

  // 국가를 바꾸면 이전 도시를 비운다 ("대만 · 도쿄" 같은 조합을 막는다)
  const changeCountry = (country: string) => {
    form.setValue("country", country, { shouldValidate: true });
    form.setValue("city", "");
  };

  // 회사 정보 설정의 상권분석 기준을 그대로 끌어온다
  const applyBrandCriteria = () => {
    const criteria = settings?.brandAreaCriteria;

    if (!criteria) {
      Toast.error("불러올 브랜드 조건이 없어요. 회사 정보 설정에서 먼저 입력해주세요.");
      return;
    }

    // 국가·도시는 분석마다 달라지므로 덮어쓰지 않는다
    form.reset(
      {
        ...form.getValues(),
        sizeMinPy: toText(criteria.sizeMinPy),
        sizeMaxPy: toText(criteria.sizeMaxPy),
        rentMinKrw: toText(criteria.rentMinKrw),
        rentMaxKrw: toText(criteria.rentMaxKrw),
        allowableFloor: criteria.allowableFloor ?? "",
        preferredArea1st: criteria.preferredArea1st ?? "",
        preferredArea2nd: criteria.preferredArea2nd ?? "",
        preferredArea3rd: criteria.preferredArea3rd ?? "",
        signageImportance: criteria.signageImportance ?? "",
        storeSizeImportance: criteria.storeSizeImportance ?? "",
        parkingImportance: criteria.parkingImportance ?? "",
        waitingSpaceImportance: criteria.waitingSpaceImportance ?? "",
        lunchSalesImportance: criteria.lunchSalesImportance ?? "",
        // TODO(백엔드): 화면은 "저녁"인데 저장된 값은 latenight(심야)다. 확인 후 매핑을 고친다
        dinnerSalesImportance: criteria.latenightSalesImportance ?? "",
        weekdaySalesImportance: criteria.weekdaySalesImportance ?? "",
        weekendSalesImportance: criteria.weekendSalesImportance ?? "",
      },
      { keepDefaultValues: true },
    );

    Toast.success("브랜드 정보에서 조건을 불러왔어요.");
  };

  const close = () => {
    form.reset(EMPTY_CONDITION);
  };

  // 검증은 handleSubmit 안에서 일어나므로, 실패 처리는 두 번째 인자로 받아야 한다
  const submit = form.handleSubmit(
    values => {
      // TODO(API): 상권 분석 실행 API 연결
      onSubmitted(values);
    },
    errors => onInvalid?.(errors),
  );

  return { form, changeCountry, applyBrandCriteria, submit, close };
}
