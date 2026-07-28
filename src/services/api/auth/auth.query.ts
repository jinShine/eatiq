import { useMutation, useQuery } from "@tanstack/react-query";

import { getMe, signIn } from "./auth.api";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useSignInMutation() {
  return useMutation({
    mutationFn: signIn,
  });
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
  });
}
