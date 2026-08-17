import { useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Toast } from "@components/ui";

import { EMPTY_RECORD, type ProgressRecordFormValues, progressRecordSchema } from "../_components/progressRecordSchema";

type UseProgressRecordFormParams = {
  onClose: () => void;
};

export function useProgressRecordForm({ onClose }: UseProgressRecordFormParams) {
  const form = useForm<ProgressRecordFormValues>({
    resolver: zodResolver(progressRecordSchema),
    defaultValues: EMPTY_RECORD,
  });

  // 다음 액션은 개수가 정해져 있지 않아 배열 필드로 관리한다
  const actions = useFieldArray({ control: form.control, name: "nextActions" });

  // 닫을 때 입력값을 비워야 다음에 열었을 때 이전 내용이 남지 않는다
  const close = () => {
    form.reset(EMPTY_RECORD);
    onClose();
  };

  const submit = form.handleSubmit(values => {
    // TODO(API): 진행 기록 생성 API 연결
    console.log(values);
    Toast.success("진행 기록을 저장했어요.");
    close();
  });

  return { form, actions, submit, close };
}
