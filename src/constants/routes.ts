const ROUTES = {
  ROOT: "/",

  AUTH: {
    ROOT: "/auth",
    SIGN_IN: "/auth/sign-in",
    SIGN_UP: "/auth/sign-up",
  },

  CUSTOM404: "/404",
} as const;

export default ROUTES;
