/**
 * Google Analytics 이벤트 트래킹 유틸리티
 *
 * 두 가지 방식을 지원합니다:
 *
 * 1. GTM 방식 (trackEvent)
 *    - dataLayer.push()를 통해 GTM으로 이벤트를 전달합니다.
 *    - GTM 콘솔에서 태그/트리거/변수를 설정해야 GA4로 전송됩니다.
 *    - 장점: GTM 콘솔에서 이벤트 매핑, 필터링, 다른 도구 연동 가능
 *
 * 2. gtag 직접 방식 (gtagEvent)
 *    - gtag('event', ...) 를 직접 호출하여 GA4로 바로 전송합니다.
 *    - GTM 콘솔에서 별도 설정 없이 즉시 동작합니다.
 *    - 장점: 설정 간단, 코드만으로 완결
 *
 * @see https://developers.google.com/tag-platform/tag-manager/datalayer
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 */

// ─── Types ─────────────────────────────────────────────

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

type GtagCommand = "config" | "event" | "set";

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
    gtag: (command: GtagCommand, targetOrAction: string, params?: Record<string, unknown>) => void;
  }
}

// ─── GTM 방식 (dataLayer.push) ─────────────────────────

/**
 * GTM dataLayer에 커스텀 이벤트를 push합니다.
 * GTM 콘솔에서 트리거/태그를 설정해야 GA4로 전송됩니다.
 *
 * @example
 * ```ts
 * trackEvent('brand_tab_change', { tab_name: 'REPORT', brand_id: 123 });
 * ```
 */
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
};

// ─── gtag 직접 방식 ────────────────────────────────────

/**
 * gtag()를 직접 호출하여 GA4로 이벤트를 즉시 전송합니다.
 * GTM 콘솔에서 별도 설정 없이 바로 동작합니다.
 *
 * @example
 * ```ts
 * gtagEvent('brand_tab_change', { tab_name: 'REPORT', brand_id: 123 });
 * ```
 */
export const gtagEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", eventName, params);
};

// ─── 페이지뷰 ─────────────────────────────────────────

/**
 * 페이지뷰 이벤트를 push합니다.
 * App Router에서 클라이언트 네비게이션 시 사용합니다.
 *
 * @example
 * ```ts
 * trackPageView('/brand/123?tab=REPORT');
 * ```
 */
export const trackPageView = (url: string) => {
  trackEvent("page_view", {
    page_location: url,
  });
};
