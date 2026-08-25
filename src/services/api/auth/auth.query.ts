import { useMutation, useQuery } from "@tanstack/react-query";

import { IS_MOCK, mockResolve } from "../mock";
import { getMe, signIn } from "./auth.api";
import { mockAuthResponse, mockMe } from "./auth.mock";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useSignInMutation() {
  return useMutation({
    mutationFn: IS_MOCK ? () => mockResolve(mockAuthResponse) : signIn,
  });
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: IS_MOCK ? () => mockResolve(mockMe) : getMe,
  });
}
