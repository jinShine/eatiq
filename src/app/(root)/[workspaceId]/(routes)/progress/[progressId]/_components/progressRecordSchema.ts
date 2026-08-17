import z from "zod";

// 다음 액션 1건 — 사용자가 여러 개 추가·삭제할 수 있다
const nextActionSchema = z.object({
  title: z.string(), // 액션 제목
  dueDate: z.string(), // 마감일 (YYYY-MM-DD)
  assignee: z.string(), // 담당자
  memo: z.string(), // 메모
});

// TODO(API): 진행 기록 생성 API가 나오면 요청 스키마에 맞춰 키를 조정한다
export const progressRecordSchema = z.object({
  recordType: z.string().min(1, "진행 타입을 선택해주세요"), // meeting/call/email_out ...
  title: z.string().min(1, "기록 제목을 입력해주세요"),
  occurredAt: z.string().min(1, "진행 날짜를 입력해주세요"),
  counterpart: z.string(), // 상대 (선택)
  content: z.string().min(1, "진행 내용을 입력해주세요"),
  nextActions: z.array(nextActionSchema),
});

export type ProgressRecordFormValues = z.infer<typeof progressRecordSchema>;
export type NextActionFormValues = z.infer<typeof nextActionSchema>;

/** 액션 추가 버튼을 누를 때 붙일 빈 행 */
export const EMPTY_ACTION: NextActionFormValues = {
  title: "",
  dueDate: "",
  assignee: "",
  memo: "",
};

export const EMPTY_RECORD: ProgressRecordFormValues = {
  recordType: "",
  title: "",
  occurredAt: "",
  counterpart: "",
  content: "",
  nextActions: [EMPTY_ACTION], // 시안처럼 첫 액션 1개를 미리 펼쳐둔다
};
