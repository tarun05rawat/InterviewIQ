import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { credentialsConfig } from "./providers/credentials";

export const authConfig: AuthOptions = {
  providers: [CredentialsProvider(credentialsConfig)],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
