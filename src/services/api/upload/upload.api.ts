import axiosClientInstance from "@services/axios.client";

import { type UploadImageResponse, type UploadVideoResponse } from "./upload.type";

const BASE_PATH = "/api/upload";

const ENDPOINTS = {
  image: `${BASE_PATH}/image`,
  video: `${BASE_PATH}/video`,
};

/** 업로드 진행률(0~100) 콜백 — 큰 영상은 오래 걸려 칸에 진행률을 보여준다 */
type OnProgress = (percent: number) => void;

const upload = async <T>(path: string, file: File, onProgress?: OnProgress) => {
  const body = new FormData();
  body.append("file", file);

  const res = await axiosClientInstance.post<T>(path, body, {
    // 인스턴스 기본값(application/json)을 덮어쓴다. boundary는 axios가 FormData를 보고 붙인다
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: event => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
  return res.data;
};

/** 이미지 업로드 — 서버 제한: jpeg·png·webp·gif·svg, 10MB */
export const uploadImage = (file: File, onProgress?: OnProgress) =>
  upload<UploadImageResponse>(ENDPOINTS.image, file, onProgress);

/** 영상 업로드 — 서버 제한: mp4·webm·mov·avi, 100MB */
export const uploadVideo = (file: File, onProgress?: OnProgress) =>
  upload<UploadVideoResponse>(ENDPOINTS.video, file, onProgress);
