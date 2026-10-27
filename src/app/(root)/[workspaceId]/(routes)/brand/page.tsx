import { type Metadata } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import BrandContainer from "./_container";

export const metadata: Metadata = configureSEOMetadata({ title: "브랜드 탐색" });

export default function BrandPage() {
  return <BrandContainer />;
}
