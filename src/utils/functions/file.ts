import type { AxiosResponse } from "axios";

/**
 * 바이트를 메가바이트로 변환
 * @example
 * bytesToMB(1048576) // returns 1
 */
export const bytesToMB = (bytes: number) => bytes / 1024 ** 2;

/**
 * 파일 타입이 허용된 타입 목록에 포함되는지 확인
 * @example
 * isValidFileType(file, ['image/jpeg', 'image/png'])
 */
export function isValidFileType(file: File, allowedTypes: string[]) {
  return allowedTypes.includes(file.type);
}

/**
 * 파일 확장자가 허용된 확장자 목록에 포함되는지 확인
 *
 * - `accept`는 확장자 기준이므로, 실제 업로드 검증도 확장자 기준 유틸을 두는 게 안전합니다.
 * - 브라우저/OS에 따라 `file.type`이 비어있거나 다를 수 있어 MIME 체크만으로는 누락될 수 있어요.
 *
 * @example
 * isValidFileExtension(file, ["jpg", "jpeg", "png","pdf", "doc", "docx", "xls", "xlsx", ...other allowed extensions]) // returns true/false
 */
export const isValidFileExtension = (file: File, allowedExtensions: readonly string[]): boolean => {
  if (!allowedExtensions.length) {
    return false;
  }

  const fileName = file?.name ?? "";
  // ".env" 처럼 점으로 시작하고 추가 점이 없는 숨김파일은 확장자로 취급하지 않음
  if (/^\.[^./\\]+$/.test(fileName)) {
    return false;
  }

  const extension = getFileExtension(fileName);
  if (!extension) {
    return false;
  }

  const normalizedAllowedExtensions = allowedExtensions.map(ext => ext.replace(/^\./, "").toLowerCase());

  return normalizedAllowedExtensions.includes(extension);
};

/**
 * 파일 크기가 최대 허용 크기 이하인지 확인
 * @example
 * isValidFileSize(file, 5) // 5MB 이하인지 확인
 */
export function isValidFileSize(file: File, maxSizeInMB: number) {
  const maxBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * 파일명에서 확장자 추출
 * @param filename - 파일명
 * @returns 확장자 문자열 (점 제외), 확장자가 없으면 빈 문자열
 * @example
 * getFileExtension('image.jpg') // returns 'jpg'
 * getFileExtension('file') // returns ''
 * getFileExtension('.hidden') // returns 'hidden'
 */
export function getFileExtension(filename: string): string {
  if (!filename || typeof filename !== "string") {
    return "";
  }
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return "";
  }
  return filename.slice(lastDotIndex + 1).toLowerCase();
}

/**
 * 바이트 크기를 사람이 읽기 쉬운 형식으로 변환
 * @example
 * formatFileSize(1024) // returns '1 KB'
 * formatFileSize(1234567) // returns '1.18 MB'
 */
export function formatFileSize(bytes: number, decimals = 2) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * File 객체를 Base64 문자열로 변환
 * @example
 * const base64 = await fileToBase64(file);
 * console.log(base64); // data:image/jpeg;base64,...
 */
export const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

/**
 * 문자열이 Base64 이미지인지 확인
 * @example
 * isBase64Img('data:image/jpeg;base64,...') // returns true
 * isBase64Img('hello world') // returns false
 */
export const isBase64Img = (baseurl: unknown): baseurl is string => {
  if (typeof baseurl !== "string") {
    return false;
  }
  const [meta] = baseurl.split(";");
  return meta.includes("data:image");
};

/**
 * 파일로부터 임시 미리보기 URL을 생성하는 함수
 * @param file - File 객체
 * @param autoRevokeMs - 자동으로 URL을 해제할 시간(밀리초), 기본값: 60000 (60초), 0이면 자동 해제 안함
 * @returns 생성된 Blob URL
 * @example
 * 이미지 파일 미리보기 생성
 *
 * const file = event.target.files[0];
 * const previewUrl = previewImageURL(file);
 * imageElement.src = previewUrl;
 * // 사용 후 수동으로 해제하려면: URL.revokeObjectURL(previewUrl);
 */
export const previewImageURL = (file: File, autoRevokeMs: number = 60000): string => {
  const imageURL = URL.createObjectURL(file);

  if (autoRevokeMs > 0) {
    setTimeout(() => {
      URL.revokeObjectURL(imageURL);
    }, autoRevokeMs);
  }

  return imageURL;
};

/************************************************
 * 파일 다운로드
 ***********************************************/

/**
 * URL로부터 파일명 추출
 * @example
 * extractFileName('https://example.com/files/image.jpg') // returns 'image.jpg'
 * extractFileName('https://example.com/files/doc%20file.pdf') // returns 'doc file.pdf'
 */
export function extractFileName(url: string): string {
  try {
    const urlObj = new URL(url);
    return decodeURIComponent(urlObj.pathname.split("/").pop() || "file");
  } catch {
    return url.split("/").pop() || "file";
  }
}

/**
 * Blob에서 파일 다운로드
 * @example
 *
 * [이미지 Blob 다운로드]
 * const response = await fetch('https://example.com/image.jpg');
 * const blob = await response.blob();
 * downloadFromBlob(blob, 'my-image.jpg');
 *
 * [Canvas에서 생성된 Blob 다운로드]
 * const canvas = document.createElement('canvas');
 * canvas.toBlob((blob) => {
 *   if (blob) downloadFromBlob(blob, 'canvas-image.png');
 * }, 'image/png');
 */
export function downloadFromBlob(blob: Blob, fileName?: string): void {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName || "file";

  try {
    document.body.appendChild(link);
    link.click();
  } finally {
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  }
}

/**
 * URL에서 파일 다운로드
 * @example
 *
 * [기본 다운로드]
 * await downloadFromUrl('https://example.com/file.pdf');
 *
 * [진행률 표시와 함께 다운로드]
 * await downloadFromUrl('https://example.com/large-file.zip', {
 *   fileName: 'my-custom-name.zip',
 *   onProgress: (progress) => console.log(`Downloaded: ${progress.toFixed(1)}%`),
 *   onError: (error) => console.error('Download failed:', error)
 * });
 */
export async function downloadFromUrl(
  url: string,
  options: {
    fileName?: string;
    contentType?: string;
    onProgress?: (progress: number) => void;
    onError?: (error: Error) => void;
  } = {},
): Promise<void> {
  const { fileName = extractFileName(url), onProgress, onError } = options;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Progress 처리
    if (onProgress && response.body) {
      const contentLength = Number(response.headers.get("Content-Length")) || 0;
      let loaded = 0;

      const reader = response.body.getReader();
      const chunks: BlobPart[] = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
        loaded += value.length;
        // contentLength가 0이면 로드된 양만 표시
        const progress = contentLength > 0 ? (loaded / contentLength) * 100 : loaded;
        onProgress(Math.min(progress, 100));
      }

      const blob = new Blob(chunks);
      downloadFromBlob(blob, fileName);
      return;
    }

    const blob = await response.blob();
    downloadFromBlob(blob, fileName);
  } catch (error) {
    if (error instanceof Error) {
      onError?.(error);
      throw error;
    }

    throw new Error("다운로드 실패");
  }
}

/**
 * Axios 응답에서 파일 다운로드
 * @example
 *
 * [Axios를 사용한 파일 다운로드]
 * const response = await axios.get('https://example.com/file.pdf', {
 *   responseType: 'blob'
 * });
 * downloadFromResponse(response, {
 *   fileName: 'document.pdf',
 *   onError: (error) => console.error('Download failed:', error)
 * });
 *
 * [Content-Disposition 헤더를 사용한 다운로드]
 * const response = await axios.get('/api/download', {
 *   responseType: 'blob',
 *   headers: { Accept: 'application/octet-stream' }
 * });
 * downloadFromResponse(response); // 서버에서 제공하는 파일명 사용
 */
export function downloadFromResponse(
  response: AxiosResponse<Blob>,
  options: {
    fileName?: string;
    contentType?: string;
    onProgress?: (progress: number) => void;
    onError?: (error: Error) => void;
  } = {},
): void {
  const { fileName, onError } = options;

  try {
    const contentDisposition = response.headers["content-disposition"];
    const serverFileName = contentDisposition
      ? decodeURIComponent(contentDisposition.split("filename=")[1]?.replace(/['"]/g, ""))
      : null;

    const finalFileName = fileName || serverFileName || "file";
    downloadFromBlob(response.data, finalFileName);
  } catch (error) {
    if (error instanceof Error) {
      onError?.(error);
      throw error;
    }

    throw new Error("다운로드 실패");
  }
}
