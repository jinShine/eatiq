"use client";

import { type MessagePayload, getMessaging, getToken, onMessage } from "firebase/messaging";

import { getFirebaseApp } from "./app";

// 1. 공통 환경 체크 및 메시징 객체 반환
const getMessagingInstance = () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  return getMessaging(app);
};

/**
 * FCM 토큰 요청
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) {
      return null;
    }

    // 알림 권한 요청
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }

    // 💡 sw.js가 아닌 firebase-messaging-sw.js를 직접 지정해서 등록
    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration, // 이 부분이 핵심
    });

    return token;
  } catch (error) {
    console.error("[FCM] Token Error:", error);
    return null;
  }
};

/**
 * 포그라운드 메시지 리스너 설정
 */
export const setupForegroundMessageListener = async (onMessageReceived?: (payload: MessagePayload) => void) => {
  const messaging = await getMessagingInstance();
  if (!messaging) {
    return null;
  }

  return onMessage(messaging, payload => {
    // 알림 표시 로직
    if (payload.notification && Notification.permission === "granted") {
      const { title, body, icon } = payload.notification;
      new Notification(title || "알림", {
        body,
        icon: icon || "/icons/icon-192x192.png",
        data: payload.data,
      });
    }

    if (onMessageReceived) {
      onMessageReceived(payload);
    }
  });
};
