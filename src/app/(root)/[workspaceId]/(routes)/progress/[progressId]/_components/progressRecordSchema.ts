import z from "zod";

import {
  type CreateCrmActionRequest,
  type CrmActionType,
  type UpdateCrmActionRequest,
} from "@services/api/crm/crm.type";

import { type ProgressRecord } from "./progressDetailView";
import { ACTION_TYPE_META } from "./recordOptions";

/************************************
 * 진행 기록 드로어 폼 — 필드 이름은 저장 DTO(POST /api/crm/action)와 같다
 ************************************/

/** 서버에 길이 제한이 없어 화면에서 막는다 */
const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 2000;

const ACTION_TYPE_VALUES = Object.keys(ACTION_TYPE_META) as [CrmActionType, ...CrmActionType[]];

const tooLong = (max: number) => `${max}자 이내로 입력해주세요`;

// 다음 액션 1건 — 사용자가 여러 개 추가·삭제할 수 있다
const nextActionSchema = z.object({
  title: z.string().trim().max(MAX_TITLE_LENGTH, tooLong(MAX_TITLE_LENGTH)),
  action_time: z.string(), // 마감일 (YYYY-MM-DD)
  partner_name: z.string().trim().max(MAX_TITLE_LENGTH, tooLong(MAX_TITLE_LENGTH)), // 담당자
  content: z.string().trim().max(MAX_CONTENT_LENGTH, tooLong(MAX_CONTENT_LENGTH)), // 메모
});

/** 다음 액션 행이 통째로 비었는지 — 빈 행은 저장할 때 버린다 */
const isEmptyAction = (action: z.infer<typeof nextActionSchema>) =>
  !action.title && !action.action_time && !action.partner_name && !action.content;

export const progressRecordSchema = z.object({
  action_type: z
    .union([z.literal(""), z.enum(ACTION_TYPE_VALUES)])
    // value !== ""로 쓰면 TS가 타입을 좁혀 폼 기본값("")이 타입 오류가 난다 — Boolean으로 검사한다
    .refine(value => Boolean(value), "진행 타입을 선택해주세요"),
  title: z.string().trim().min(1, "기록 제목을 입력해주세요").max(MAX_TITLE_LENGTH, tooLong(MAX_TITLE_LENGTH)),
  action_time: z.string().min(1, "진행 날짜를 입력해주세요"),
  partner_name: z.string().trim().max(MAX_TITLE_LENGTH, tooLong(MAX_TITLE_LENGTH)),
  content: z.string().trim().max(MAX_CONTENT_LENGTH, tooLong(MAX_CONTENT_LENGTH)),
  next_actions: z.array(nextActionSchema).superRefine((actions, ctx) => {
    // 빈 행은 괜찮지만, 무엇이든 적었다면 제목은 있어야 한다(서버 필수)
    actions.forEach((action, index) => {
      if (!isEmptyAction(action) && !action.title) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [index, "title"], message: "액션 제목을 입력해주세요" });
      }
    });
  }),
});

export type ProgressRecordFormValues = z.infer<typeof progressRecordSchema>;
export type NextActionFormValues = z.infer<typeof nextActionSchema>;

/** 액션 추가 버튼을 누를 때 붙일 빈 행 */
export const EMPTY_ACTION: NextActionFormValues = {
  title: "",
  action_time: "",
  partner_name: "",
  content: "",
};

export const EMPTY_RECORD: ProgressRecordFormValues = {
  action_type: "",
  title: "",
  action_time: "",
  partner_name: "",
  content: "",
  next_actions: [EMPTY_ACTION], // 시안처럼 첫 액션 1개를 미리 펼쳐둔다
};

/** 수정할 기록 → 폼 값. 다음 액션은 수정 화면에서 다루지 않는다 */
export const toRecordFormValues = (record: ProgressRecord): ProgressRecordFormValues => ({
  action_type: ACTION_TYPE_VALUES.find(type => type === record.type) ?? "지정안됨",
  title: record.title,
  action_time: record.occurredAt ?? "",
  partner_name: record.partnerName ?? "",
  content: record.content ?? "",
  next_actions: [],
});

/** 빈 선택 칸은 보내지 않는다 */
const optional = (value: string) => value || undefined;

/** 폼 → 등록 요청. 빈 다음 액션 행은 버린다 */
export const toCreateRequest = (values: ProgressRecordFormValues): Omit<CreateCrmActionRequest, "crm_uid"> => ({
  action_type: values.action_type || "지정안됨",
  title: values.title,
  action_time: values.action_time,
  partner_name: optional(values.partner_name),
  content: optional(values.content),
  next_actions: values.next_actions
    .filter(action => !isEmptyAction(action))
    .map(action => ({
      title: action.title,
      action_time: optional(action.action_time),
      partner_name: optional(action.partner_name),
      content: optional(action.content),
    })),
});

/**
 * 폼 → 수정 요청. 부분 수정이지만 모든 칸을 보낸다.
 * 선택 칸을 비웠다면 빈 문자열을 보내 지운다 — 빼고 보내면 이전 값이 남는다
 */
export const toUpdateRequest = (values: ProgressRecordFormValues): UpdateCrmActionRequest => ({
  action_type: values.action_type || "지정안됨",
  title: values.title,
  action_time: values.action_time,
  partner_name: values.partner_name,
  content: values.content,
});
