"use client";

import dynamic from "next/dynamic";

import { type PdfDocumentProps } from "./PdfDocument";

/**
 * PDF 미리보기.
 * pdf.js(약 1MB)는 브라우저 전용이라 서버에서 그리지 않고, 미리보기가 처음 보일 때 따로 받는다 —
 * 다른 화면의 번들에 끼지 않는다
 */
const PdfDocument = dynamic(() => import("./PdfDocument"), { ssr: false });

export default function PdfPreview(props: PdfDocumentProps) {
  // 주소가 바뀌면(다시 생성·다른 진행 건) 1쪽부터 새로 그린다
  return <PdfDocument key={props.url} {...props} />;
}
