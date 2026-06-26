"use client";

import { Suspense, useEffect } from "react";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

import { ENV_CLIENT } from "@configs/env/client";

import { trackPageView } from "./gtm";

// ─── Constants ─────────────────────────────────────────

const { GTM_ID } = ENV_CLIENT;

// ─── Component ─────────────────────────────────────────

export default function GTMProvider() {
  if (!GTM_ID) {
    return null;
  }

  return (
    <>
      {/* GTM Script */}
      <Script id="gtm-script" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>

      {/* GTM noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      {/* useSearchParams()는 Suspense 경계 내에서 사용해야 합니다 */}
      <Suspense fallback={null}>
        <GTMPageViewTracker />
      </Suspense>
    </>
  );
}

function GTMPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GTM_ID || !pathname) {
      return;
    }

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}
