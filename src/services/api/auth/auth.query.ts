import { useMutation } from "@tanstack/react-query";

import { signIn } from "./auth.api";

export function useSignInMutation() {
  return useMutation({
    mutationFn: signIn,
  });
}
