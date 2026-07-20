/**
 * 성공 응답 — 백엔드 CommonResponse (success: true)
 * data의 타입만 T로 바뀌고, 껍데기(success·message)는 항상 동일
 */
export type ApiResponse<T> = {
  success: true;
  data: T;
  message: string;
};

/**
 * 실패 응답 — 백엔드 CommonResponse (success: false)
 * axios의 catch에서 error.response.data 로 받게 됨
 */
export type ApiErrorResponse = {
  success: false;
  errorCode: string;
  message: string;
};
