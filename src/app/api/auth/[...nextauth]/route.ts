import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import axiosInstance from "@services/axios.client";

const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async credentials => {
        if (!credentials) {
          return null;
        }

        const { email, password } = credentials;
        const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
          email,
          password,
        });

        console.log("auth.ts response : ", response);

        const user = { id: "", name: "", email: "", image: "" };

        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token }) {
      console.log("auth.ts jwt : ", token);
      return token;
    },
    session({ session, token }) {
      console.log("auth.ts session : ", session, token);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
