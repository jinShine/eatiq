export const isDevelopmentOrStaging = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const nextPublicEnv = process.env.NEXT_PUBLIC_ENV;
  const nodeEnv = process.env.NODE_ENV as string | undefined;

  // development 환경 체크
  if (nextPublicEnv === "development" || nodeEnv === "development") {
    return true;
  }

  // staging 환경 체크 (NODE_ENV가 staging이거나 NEXT_PUBLIC_ENV가 development인 경우)
  // staging.yaml에서 NEXT_PUBLIC_ENV를 development로 설정하므로, staging도 development로 체크
  if (nodeEnv === "staging" || (nextPublicEnv === "development" && nodeEnv !== "production")) {
    return true;
  }

  return false;
};

export const getEnvironmentName = (): string => {
  if (typeof window === "undefined") {
    return "Unknown";
  }

  const nextPublicEnv = process.env.NEXT_PUBLIC_ENV;
  const nodeEnv = process.env.NODE_ENV as string | undefined;

  if (nodeEnv === "staging") {
    return "Staging";
  }
  if (nextPublicEnv === "development" || nodeEnv === "development") {
    return "Development";
  }
  if (nextPublicEnv === "production" || nodeEnv === "production") {
    return "Production";
  }

  return "Unknown";
};
