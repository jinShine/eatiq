import { type Viewport } from "next";

import { configureSEOMetadata } from "@configs/seo/config";

import { monoFont, sansFont } from "@styles/font/global-font";

import "../styles/css/globals.css";
import AppProvider from "./AppProvider";

export const metadata = configureSEOMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${sansFont.variable} ${monoFont.variable}`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
