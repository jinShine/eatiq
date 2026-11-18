"use client";

import { useEffect, useRef } from "react";

/**
 * PageHeader의 실제 높이를 CSS 변수(--page-header-h)로 알린다.
 *
 * 헤더는 부제 유무·줄바꿈으로 높이가 달라진다(64~69px). 그 아래에 붙는 것(저니 패널 스크롤 바)과
 * 스크롤 여백(scroll-mt-settings)이 숫자를 직접 들고 있으면 몇 px씩 헤더에 묻힌다.
 * 화면엔 아무것도 그리지 않고, 감싼 header를 재기만 한다
 */
export default function PageHeaderHeightSync() {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const header = markerRef.current?.closest("header");
    if (!header) {
      return;
    }
    const root = document.documentElement;
    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty("--page-header-h", `${entry.borderBoxSize[0]?.blockSize ?? header.offsetHeight}px`);
    });
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--page-header-h");
    };
  }, []);

  return <span ref={markerRef} hidden />;
}
