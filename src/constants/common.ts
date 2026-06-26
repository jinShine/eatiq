/************************************************************/
/** TYPE */
/************************************************************/

export type SearchParamsType = Promise<{ [key: string]: string | string[] | undefined }>;

// 정렬 순서
export type SortOrderType = "asc" | "desc";

// 전체 타입
export type AllType = "전체";

/************************************************************/
/** VARIABLE */
/************************************************************/

// 전체 타입
export const ALL_ITEMS_LABEL: AllType = "전체";

// 페이지당 보여지는 아이템 수
export const PER_PAGE = 30;

/************************************************************/
/** URL */
/************************************************************/

export const SEARCH_PARAMS_KEYS = {
  CALLBACK_URL: "callbackUrl",
} as const;

export const URL = {};
