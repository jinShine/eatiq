"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@components/ui";

import { useUnsavedChangesStore } from "@stores/useUnsavedChangesStore";

/** 새 탭·수정키 클릭·외부 주소는 지금 화면을 떠나지 않으니 막지 않는다 */
const getLeavingHref = (event: MouseEvent): string | null => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return null;
  }
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) {
    return null;
  }
  // 같은 화면 안의 #이동은 입력을 잃지 않는다
  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    return null;
  }
  return `${url.pathname}${url.search}${url.hash}`;
};

/**
 * 저장하지 않은 설정이 있을 때 화면을 떠나면 확인을 받는다.
 *
 * - 링크(설정 탭·화면 안 링크): 클릭을 캡처 단계에서 가로채 확인 후 이동
 * - 버튼으로 이동하는 곳(사이드바): 그쪽에서 requestLeave를 거친다
 * - 새로고침·창 닫기: 브라우저 기본 확인창(beforeunload)
 * 브라우저 뒤로 가기는 App Router에서 막을 수 없어 다루지 않는다.
 */
export default function UnsavedChangesGuard() {
  const router = useRouter();
  const hasUnsaved = useUnsavedChangesStore(state => state.dirtyIds.length > 0);
  const pendingLeave = useUnsavedChangesStore(state => state.pendingLeave);
  const requestLeave = useUnsavedChangesStore(state => state.requestLeave);
  const confirmLeave = useUnsavedChangesStore(state => state.confirmLeave);
  const cancelLeave = useUnsavedChangesStore(state => state.cancelLeave);

  useEffect(() => {
    if (!hasUnsaved) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    // document 캡처 단계는 React(루트)와 Next Link보다 먼저 받는다
    const handleClick = (event: MouseEvent) => {
      const href = getLeavingHref(event);
      if (!href) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      requestLeave(() => router.push(href));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
    };
  }, [hasUnsaved, requestLeave, router]);

  return (
    <Modal
      isOpen={pendingLeave !== null}
      onOpenChange={open => !open && cancelLeave()}
      className="w-full sm:max-w-[440px]"
    >
      <ModalHeader>저장하지 않은 변경사항이 있어요</ModalHeader>
      <ModalBody>
        <p className="text-text-secondary text-sm leading-relaxed">지금 나가면 입력한 내용이 사라져요.</p>
      </ModalBody>
      <ModalFooter className="border-border border-t pt-4">
        <Button variant="outline" onClick={cancelLeave}>
          계속 작성
        </Button>
        <Button variant="destructive" onClick={confirmLeave}>
          나가기
        </Button>
      </ModalFooter>
    </Modal>
  );
}
