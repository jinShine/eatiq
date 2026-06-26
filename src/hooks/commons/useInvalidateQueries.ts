import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";

export default function useInvalidateQueries() {
  const queryClient = useQueryClient();

  const single = useCallback(
    (queryKey: QueryKey) => {
      return queryClient.invalidateQueries({ queryKey });
    },
    [queryClient],
  );

  const multiple = useCallback(
    (queryKeys: QueryKey[]) => {
      return Promise.all(queryKeys.map(queryKey => queryClient.invalidateQueries({ queryKey })));
    },
    [queryClient],
  );

  const reset = useCallback(
    (queryKey?: QueryKey) => {
      queryClient.resetQueries({ queryKey });
    },
    [queryClient],
  );

  const clear = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  return { reset, single, multiple, clear };
}
