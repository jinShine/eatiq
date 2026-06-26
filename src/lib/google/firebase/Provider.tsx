"use client";

import { useEffect } from "react";

import { getAnalytics, isSupported } from "firebase/analytics";

import { getFirebaseApp } from "./app";

const initFirebase = async () => {
  const app = getFirebaseApp();
  if (!app) {
    return;
  }

  const supported = await isSupported();
  if (!supported) {
    return;
  }

  getAnalytics(app);
};

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void initFirebase();
  }, []);

  return <>{children}</>;
}
