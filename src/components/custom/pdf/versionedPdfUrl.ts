/**
 * 다시 만들어도 PDF 주소가 그대로라 브라우저·CDN에 남은 이전 파일이 보일 수 있다.
 * 생성(수정) 시각을 붙여 다시 만들 때마다 다른 주소로 받는다
 */
export const toVersionedPdfUrl = (pdfUrl: string, updatedTime: string | null | undefined) =>
  updatedTime ? `${pdfUrl}?v=${encodeURIComponent(updatedTime)}` : pdfUrl;
