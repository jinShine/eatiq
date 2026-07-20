export type UserType = "brand" | "buyer";

export type User = {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  emailVerified: boolean;
  lastBrandId: string | null;
};

// 로그인 요청 바디
export type SignInRequest = {
  email: string;
  password: string;
};

// 로그인 성공 시 data 안에 들어오는 내용
export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
};
