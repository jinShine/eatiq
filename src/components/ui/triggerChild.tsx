import { Fragment, isValidElement } from "react";

/**
 * Radix 트리거(asChild)에 넘길 자식. Modal · Sheet · Popover · DropdownMenu가 같이 쓴다.
 *
 * 버튼 같은 요소 하나면 그대로 넘겨 트리거가 그 요소가 되게 한다. div로 감싸면 열림 상태(aria-expanded)가
 * div에 붙어 화면 낭독기가 모르고, 닫을 때 포커스가 포커스 불가인 div로 돌아가 body로 빠진다.
 *
 * 글자·Fragment·여러 요소처럼 트리거가 될 수 없는 값은 예전처럼 div로 감싼다 — 쓰는 쪽은 무엇이든 넘길 수 있다.
 * 컴포넌트를 넘길 때는 받은 props(onClick·ref 등)를 DOM까지 넘겨야 한다(Button·MoreButton은 넘긴다).
 */
export function triggerChild(trigger: React.ReactNode) {
  if (isValidElement(trigger) && trigger.type !== Fragment) {
    return trigger;
  }
  return <div className="w-fit">{trigger}</div>;
}
