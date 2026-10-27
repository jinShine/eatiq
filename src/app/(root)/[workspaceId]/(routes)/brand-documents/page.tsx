import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import BrandDocumentsContainer from "./_container";

export const metadata: Metadata = configureSEOMetadata({ title: "회사 문서 작성" });

export default function BrandDocumentsPage() {
  return <BrandDocumentsContainer />;
}
