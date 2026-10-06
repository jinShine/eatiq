import { type components } from "@services/openapi";

/** 파일 업로드 — S3에 올리고 받은 url을 각 저장 API(로고·대표 이미지·메뉴 사진 등)에 넣는다 */
export type UploadImageResponse = components["schemas"]["UploadImageResponseDto"];
export type UploadVideoResponse = components["schemas"]["UploadVideoResponseDto"];
