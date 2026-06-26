import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";

import { ENV_CLIENT } from "@configs/env/client";

type FirebasePublicEnv = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

const getFirebasePublicEnv = (): FirebasePublicEnv | null => {
  const apiKey = ENV_CLIENT.FIREBASE_API_KEY;
  const authDomain = ENV_CLIENT.FIREBASE_AUTH_DOMAIN;
  const projectId = ENV_CLIENT.FIREBASE_PROJECT_ID;
  const storageBucket = ENV_CLIENT.FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = ENV_CLIENT.FIREBASE_MESSAGING_SENDER_ID;
  const appId = ENV_CLIENT.FIREBASE_APP_ID;
  const measurementId = ENV_CLIENT.FIREBASE_MEASUREMENT_ID;

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  };
};

let cachedApp: FirebaseApp | null = null;

export const getFirebaseApp = () => {
  if (cachedApp) {
    return cachedApp;
  }
  const firebaseEnv = getFirebasePublicEnv();
  if (!firebaseEnv) {
    return null;
  }

  cachedApp = getApps().length ? getApp() : initializeApp(firebaseEnv);
  return cachedApp;
};
