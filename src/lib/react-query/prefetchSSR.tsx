import "server-only";

import { dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "./getQueryClient";

type BasePrefetchOptions = {
  queryKey: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryFn: () => Promise<any>;
};

type PrefetchQueryOptions = BasePrefetchOptions & {
  type: "query";
};

type PrefetchInfiniteQueryOptions = BasePrefetchOptions & {
  type: "infinite";
  initialPageParam: number | string;
};

type PrefetchSSROptions = Array<PrefetchQueryOptions | PrefetchInfiniteQueryOptions>;

export async function prefetchQuerySSR(options: PrefetchSSROptions) {
  const qc = getQueryClient();

  await Promise.all(
    options.map(option => {
      if (option.type === "infinite") {
        return qc.prefetchInfiniteQuery({
          queryKey: option.queryKey,
          queryFn: option.queryFn,
          initialPageParam: option.initialPageParam,
        });
      }

      return qc.prefetchQuery(option);
    }),
  );

  return dehydrate(qc);
}
