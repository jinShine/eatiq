"use client";

import { Activity } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ArrowLeftIcon } from "lucide-react";

import { type ButtonProps, HeaderIconButton } from "@components/ui";

import { SEARCH_PARAMS_KEYS } from "@constants/common";
import ROUTES from "@constants/routes";

export default function HeaderBackButton({ ...props }: ButtonProps) {
  // ** Hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ** Vars
  const isRootPath = pathname === ROUTES.ROOT;
  const callbackUrl = searchParams.get(SEARCH_PARAMS_KEYS.CALLBACK_URL);

  // ** Handlers
  const handleBack = () => {
    if (callbackUrl) {
      router.replace(callbackUrl);
    } else if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`${ROUTES.ROOT}`);
    }
  };

  return (
    <Activity mode={isRootPath ? "hidden" : "visible"}>
      <HeaderIconButton onClick={handleBack} {...props}>
        <ArrowLeftIcon />
      </HeaderIconButton>
    </Activity>
  );
}
