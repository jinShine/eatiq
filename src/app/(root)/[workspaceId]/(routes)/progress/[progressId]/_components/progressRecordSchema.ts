import z from "zod";

import {
  type CreateCrmActionRequest,
  type CrmActionType,
  type UpdateCrmActionRequest,
} from "@services/api/crm/crm.type";

import { type ProgressRecord } from "./progressDetailView";
import { ACTION_TYPE_META, DEFAULT_ACTION_TYPE } from "./recordOptions";

/************************************
 * 진행 기록 드로어 폼 — 필드 이름은 저장 DTO(POST /api/crm/action)와 같다
 ************************************/

/** 기록 제목 — 서버 상한(255자) */
const MAX_TITLE_LENGTH = 255;
/** 다음 액션 제목·담당자·상대 — 서버에 상한이 없어 화면에서 막는다 */
const MAX_NAME_LENGTH = 100;
const MAX_CONTENT_LENGTH = 2000;

const ACTION_TYPE_VALUES = Object.keys(ACTION_TYPE_META) as [CrmActionType, ...CrmActionType[]];

const tooLong = (max: number) => `${max}자 이내로 입력해주세요`;

// 다음 액션 1건 — 사용자가 여러 개 추가·삭제할 수 있다
const nextActionSchema = z.object({
  /** 이미 있는 액션의 번호 — 새 행이면 없다(서버가 발급). 화면에는 보이지 않고 저장할 때 그대로 보낸다 */
  idx: z.number().optional(),
  /** 완료 여부 — 화면에서 고치지 않지만 빠뜨리면 서버가 N으로 되돌려서 그대로 들고 있는다 */
  is_done: z.enum(["Y", "N"]),
  title: z.string().trim().max(MAX_NAME_LENGTH, tooLong(MAX_NAME_LENGTH)),
  deadline: z.string(), // 마감일 (YYYY-MM-DD)
  partner_name: z.string().trim().max(MAX_NAME_LENGTH, tooLong(MAX_NAME_LENGTH)), // 담당자
  memo: z.string().trim().max(MAX_CONTENT_LENGTH, tooLong(MAX_CONTENT_LENGTH)),
});

/** 새로 쓴 행이 통째로 비었는지 — 빈 새 행은 저장할 때 버린다(이미 있던 행은 지운 것으로 보지 않는다) */
const isEmptyNewAction = (action: z.infer<typeof nextActionSchema>) =>
  action.idx === undefined && !action.title && !action.deadline && !action.partner_name && !action.memo;

/** 첨부 파일 1건 — 업로드 API가 준 값. 화면에서 고치지 않고 그대로 보낸다 */
const actionFileSchema = z.object({
  name: z.string(),
  url: z.string(),
  size: z.number().optional(),
  mimetype: z.string().optional(),
});

export const progressRecordSchema = z.object({
  action_type: z.enum(ACTION_TYPE_VALUES, { errorMap: () => ({ message: "진행 타입을 선택해주세요" }) }),
  title: z.string().trim().min(1, "기록 제목을 입력해주세요").max(MAX_TITLE_LENGTH, tooLong(MAX_TITLE_LENGTH)),
  action_date: z.string().min(1, "진행 날짜를 입력해주세요"),
  partner_name: z.string().trim().max(MAX_NAME_LENGTH, tooLong(MAX_NAME_LENGTH)),
  content: z.string().trim().max(MAX_CONTENT_LENGTH, tooLong(MAX_CONTENT_LENGTH)),
  next_actions: z.array(nextActionSchema).superRefine((actions, ctx) => {
    // 빈 새 행은 괜찮지만, 무엇이든 적었거나 이미 있던 행이라면 제목은 있어야 한다(서버 필수)
    actions.forEach((action, index) => {
      if (!isEmptyNewAction(action) && !action.title) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [index, "title"], message: "액션 제목을 입력해주세요" });
      }
    });
  }),
  file_list: z.array(actionFileSchema),
});

export type ProgressRecordFormValues = z.infer<typeof progressRecordSchema>;
export type NextActionFormValues = z.infer<typeof nextActionSchema>;
export type ActionFileFormValues = z.infer<typeof actionFileSchema>;

/** 액션 추가 버튼을 누를 때 붙일 빈 행 */
export const EMPTY_ACTION: NextActionFormValues = {
  is_done: "N",
  title: "",
  deadline: "",
  partner_name: "",
  memo: "",
};

export const EMPTY_RECORD: ProgressRecordFormValues = {
  action_type: DEFAULT_ACTION_TYPE,
  title: "",
  action_date: "",
  partner_name: "",
  content: "",
  next_actions: [EMPTY_ACTION], // 시안처럼 첫 액션 1개를 미리 펼쳐둔다
  file_list: [],
};

/** 수정할 기록 → 폼 값. 다음 액션은 번호(idx)·완료 여부를 그대로 들고 온다 */
export const toRecordFormValues = (record: ProgressRecord): ProgressRecordFormValues => ({
  action_type: ACTION_TYPE_VALUES.find(type => type === record.type) ?? DEFAULT_ACTION_TYPE,
  title: record.title,
  action_date: record.occurredAt ?? "",
  partner_name: record.partnerName ?? "",
  content: record.content ?? "",
  next_actions: record.nextActions.map(item => ({
    idx: item.idx,
    is_done: item.isDone ? "Y" : "N",
    title: item.title,
    deadline: item.dueDate ?? "",
    partner_name: item.assignee ?? "",
    memo: item.memo ?? "",
  })),
  file_list: record.files.map(file => ({
    name: file.name,
    url: file.url,
    size: file.size ?? undefined,
    mimetype: file.mimetype ?? undefined,
  })),
});

/** 빈 선택 칸은 보내지 않는다 */
const optional = (value: string) => value || undefined;

/** 다음 액션 행 → 요청. 빈 새 행은 버린다 */
const toNextActionRequests = (actions: NextActionFormValues[]) =>
  actions
    .filter(action => !isEmptyNewAction(action))
    .map(action => ({
      idx: action.idx,
      is_done: action.is_done,
      title: action.title,
      deadline: optional(action.deadline),
      partner_name: optional(action.partner_name),
      memo: optional(action.memo),
    }));

/** 폼 → 등록 요청 */
export const toCreateRequest = (values: ProgressRecordFormValues): Omit<CreateCrmActionRequest, "crm_uid"> => ({
  action_type: values.action_type,
  title: values.title,
  action_date: values.action_date,
  partner_name: optional(values.partner_name),
  content: optional(values.content),
  // 새 기록이라 idx는 모두 없다 — 서버가 1부터 발급한다
  next_actions: toNextActionRequests(values.next_actions).map(({ idx: _idx, ...action }) => action),
  file_list: values.file_list.length > 0 ? values.file_list : undefined,
});

/**
 * 폼 → 수정 요청. 부분 수정이지만 모든 칸을 보낸다.
 * - 선택 칸을 비웠다면 빈 문자열을 보내 지운다 — 빼고 보내면 이전 값이 남는다
 * - 다음 액션은 보낸 배열로 통째로 바뀐다: idx가 있으면 그 항목을 고치고, 없으면 새로 만들고, 빠진 항목은 지워진다.
 *   항목마다 모든 칸을 보내야 한다(빠진 칸은 지워진다)
 * - 첨부 파일도 보낸 배열로 통째로 바뀐다 — 빈 배열이면 모두 지워진다(빼고 보내면 그대로 남는다)
 */
export const toUpdateRequest = (values: ProgressRecordFormValues): UpdateCrmActionRequest => ({
  action_type: values.action_type,
  title: values.title,
  action_date: values.action_date,
  partner_name: values.partner_name,
  content: values.content,
  next_actions: toNextActionRequests(values.next_actions),
  file_list: values.file_list,
});
