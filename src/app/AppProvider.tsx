"use client";

import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@components/shadcn/sonner";

import "@lib/dayjs/config";
import { GTMProvider } from "@lib/google/analytics";
import { FirebaseProvider } from "@lib/google/firebase";
import ReactQueryProvider from "@lib/react-query/Provider";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    // <AuthProvider>
    <ReactQueryProvider>
      <FirebaseProvider>
        <GTMProvider />
        <NextTopLoader showSpinner={false} />
        {children}
        <Toaster />
      </FirebaseProvider>
    </ReactQueryProvider>
    // </AuthProvider>
  );
}
