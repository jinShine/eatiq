import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        retryDelay: 1000,
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000, // 1 minute
        gcTime: 1000 * 60 * 60, // 1 hour
      },
      mutations: {},
      dehydrate: {
        shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}
