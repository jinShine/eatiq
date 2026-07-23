import { type components } from "@services/openapi";

export type UserType = "brand" | "buyer";

export type SignInRequest = components["schemas"]["LoginRequest"];
export type AuthResponse = components["schemas"]["AuthResponse"];
export type User = components["schemas"]["UserDto"];
export type TokenResponse = components["schemas"]["TokenResponse"];
